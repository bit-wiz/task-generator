<script>
    import { dndzone } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import { fade, fly } from "svelte/transition";
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import { onMount } from "svelte";
    import {
        GripVertical,
        Trash2,
        Plus,
        Save,
        Download,
        Layout,
        Server,
        TestTube,
        AlertCircle,
        Loader2,
        ArrowLeft,
        Sparkles,
        Clock,
    } from "lucide-svelte";
    import { clsx } from "clsx";

    let { data } = $props();
    let spec = $state(data.spec);
    let saving = $state(false);

    const flipDurationMs = 300;

    // Categorized task lists for Kanban view
    let frontendTasks = $state([]);
    let backendTasks = $state([]);
    let testingTasks = $state([]);

    // Sync individual lists back to the main spec.tasks
    function syncToSpec() {
        spec.tasks = [
            ...frontendTasks.map((t) => ({ ...t, group: "frontend" })),
            ...backendTasks.map((t) => ({ ...t, group: "backend" })),
            ...testingTasks.map((t) => ({ ...t, group: "testing" })),
        ];
    }

    // Initialize lists from spec.tasks
    function initializeLists() {
        frontendTasks = spec.tasks.filter((t) => t.group === "frontend");
        backendTasks = spec.tasks.filter((t) => t.group === "backend");
        testingTasks = spec.tasks.filter((t) => t.group === "testing");
    }

    // Run on initial load and whenever AI generation finishes
    $effect(() => {
        if (
            !spec.isPending &&
            frontendTasks.length === 0 &&
            backendTasks.length === 0 &&
            testingTasks.length === 0
        ) {
            initializeLists();
        }
    });

    // Countdown logic for delayed retries
    let timeLeft = $state(0);
    let timerInterval = null;

    function startTimer(targetDate) {
        clearInterval(timerInterval);
        const updateTimer = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const diff = Math.max(0, Math.floor((target - now) / 1000));
            timeLeft = diff;

            if (diff <= 0) {
                clearInterval(timerInterval);
                invalidateAll();
            }
        };
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    // DnD handlers for each zone
    function handleDnd(group, type, e) {
        const { items } = e.detail;
        if (group === "frontend") frontendTasks = items;
        if (group === "backend") backendTasks = items;
        if (group === "testing") testingTasks = items;

        if (type === "finalize") {
            syncToSpec();
        }
    }

    function addTask(group = "frontend") {
        const newTask = {
            id: Math.random().toString(36).substr(2, 9),
            title: "New task",
            group,
        };
        if (group === "frontend") frontendTasks = [...frontendTasks, newTask];
        if (group === "backend") backendTasks = [...backendTasks, newTask];
        if (group === "testing") testingTasks = [...testingTasks, newTask];
        syncToSpec();
    }

    function removeTask(id) {
        frontendTasks = frontendTasks.filter((t) => t.id !== id);
        backendTasks = backendTasks.filter((t) => t.id !== id);
        testingTasks = testingTasks.filter((t) => t.id !== id);
        syncToSpec();
    }

    function addUserStory() {
        spec.userStories = [...spec.userStories, "New user story"];
    }

    function removeUserStory(index) {
        spec.userStories = spec.userStories.filter((_, i) => i !== index);
    }

    function addRisk() {
        spec.risks = [...spec.risks, "New risk or unknown"];
    }

    function removeRisk(index) {
        spec.risks = spec.risks.filter((_, i) => i !== index);
    }

    const groupConfig = {
        frontend: {
            title: "Frontend",
            icon: Layout,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        backend: {
            title: "Backend",
            icon: Server,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
        testing: {
            title: "Testing",
            icon: TestTube,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
    };
</script>

<div class="min-h-screen bg-black text-gray-100 pb-32">
    <!-- Header Section -->
    <header
        class="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-16 z-40"
    >
        <div
            class="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
            <div class="space-y-2">
                <a
                    href="/history"
                    class="text-sm text-gray-500 hover:text-blue-400 flex items-center gap-1 transition-colors group mb-2"
                >
                    <ArrowLeft
                        class="w-3 h-3 group-hover:-translate-x-0.5 transition-transform"
                    />
                    Back to History
                </a>
                <h1
                    class="text-4xl font-extrabold tracking-tight text-white line-clamp-1"
                >
                    {spec.goal}
                </h1>
                <div class="flex items-center gap-3">
                    <span
                        class="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20"
                    >
                        {spec.template}
                    </span>
                    <span
                        class="text-gray-600 text-xs font-mono uppercase tracking-widest hidden sm:inline"
                        >ID: {spec._id}</span
                    >
                </div>
            </div>

            <div class="flex items-center gap-4">
                <form
                    method="POST"
                    action="?/update"
                    use:enhance={() => {
                        saving = true;
                        return async ({ update }) => {
                            saving = false;
                            await update();
                        };
                    }}
                >
                    <input
                        type="hidden"
                        name="spec"
                        value={JSON.stringify(spec)}
                    />
                    <button
                        type="submit"
                        disabled={saving}
                        class="bg-white text-black hover:bg-gray-200 disabled:opacity-50 px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-white/5"
                    >
                        {#if saving}
                            <Loader2 class="w-4 h-4 animate-spin" />
                            Saving...
                        {:else}
                            <Save class="w-4 h-4" />
                            Save Changes
                        {/if}
                    </button>
                </form>
                <a
                    href="/api/export/{spec._id}"
                    download
                    class="bg-gray-900 border border-gray-800 hover:border-gray-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all"
                >
                    <Download class="w-4 h-4" />
                    Export MD
                </a>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-6 mt-12">
        {#await data.streamed.content}
            <!-- Loading State -->
            <div
                class="flex flex-col items-center justify-center py-32 space-y-6"
                in:fade
            >
                <div class="relative">
                    <div
                        class="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"
                    ></div>
                    <Loader2
                        class="w-16 h-16 text-blue-500 animate-spin relative z-10"
                    />
                </div>
                <div class="text-center space-y-2">
                    <h2 class="text-2xl font-bold text-white">
                        AI is architecting...
                    </h2>
                    <p class="text-gray-500 max-w-sm">
                        Generating user stories, engineering tasks, and risk
                        assessments.
                    </p>
                </div>
            </div>
        {:then content}
            <!-- Success/Delayed State -->
            {#if content?.isDelayed}
                {(startTimer(content.nextRetryAt), "")}
                <div
                    class="flex flex-col items-center justify-center py-32 space-y-8"
                    in:fade
                >
                    <div
                        class="p-6 bg-amber-500/10 rounded-full border border-amber-500/20 relative"
                    >
                        <div
                            class="absolute inset-0 bg-amber-500/10 blur-2xl rounded-full animate-pulse"
                        ></div>
                        <Clock class="w-12 h-12 text-amber-500 relative z-10" />
                    </div>
                    <div class="text-center space-y-4 max-w-lg">
                        <h2 class="text-3xl font-bold text-white">
                            API Overloaded
                        </h2>
                        <p class="text-gray-400 text-lg">
                            The AI service is currently busy. Auto-retrying
                            soon.
                        </p>

                        <div
                            class="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 border border-gray-800 rounded-2xl"
                        >
                            <span class="text-gray-500 font-medium"
                                >Retrying in:</span
                            >
                            <span
                                class="text-2xl font-mono font-bold text-amber-400 w-20"
                                >{formatTime(timeLeft)}</span
                            >
                        </div>
                    </div>

                    <div class="text-sm text-gray-600 flex items-center gap-2">
                        <AlertCircle class="w-4 h-4" />
                        Last error: {content.error || "Connection timed out"}
                    </div>
                </div>
            {:else if content}
                <div in:fade={{ duration: 800 }}>
                    {((spec.userStories = content.userStories),
                    (spec.tasks = content.tasks),
                    (spec.risks = content.risks),
                    (spec.isPending = false),
                    "")}
                </div>
            {/if}

            {#if !content?.isDelayed}
                <div class="space-y-16" in:fly={{ y: 20, duration: 600 }}>
                    <!-- Stories & Risks -->
                    <div class="grid lg:grid-cols-2 gap-12">
                        <section class="space-y-6">
                            <div class="flex items-center justify-between">
                                <h2
                                    class="text-2xl font-bold text-white flex items-center gap-3"
                                >
                                    <Sparkles class="w-6 h-6 text-blue-400" />
                                    User Stories
                                </h2>
                                <button
                                    onclick={addUserStory}
                                    class="p-2 hover:bg-gray-800 rounded-xl text-blue-400 transition-colors border border-transparent hover:border-gray-700"
                                >
                                    <Plus class="w-5 h-5" />
                                </button>
                            </div>
                            <div class="space-y-4">
                                {#each spec.userStories as story, i}
                                    <div
                                        class="group relative"
                                        transition:fly={{ x: -10 }}
                                    >
                                        <textarea
                                            bind:value={spec.userStories[i]}
                                            class="w-full bg-gray-900/40 border border-gray-800 hover:border-blue-500/30 rounded-2xl px-6 py-5 text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all min-h-[100px] resize-none leading-relaxed"
                                            placeholder="As a user, I want..."
                                        ></textarea>
                                        <button
                                            onclick={() => removeUserStory(i)}
                                            class="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-red-500 rounded-xl text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all border border-gray-700"
                                        >
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </section>

                        <section class="space-y-6">
                            <div class="flex items-center justify-between">
                                <h2
                                    class="text-2xl font-bold text-white flex items-center gap-3"
                                >
                                    <AlertCircle class="w-6 h-6 text-red-500" />
                                    Risks / Unknowns
                                </h2>
                                <button
                                    onclick={addRisk}
                                    class="p-2 hover:bg-gray-800 rounded-xl text-red-400 transition-colors border border-transparent hover:border-gray-700"
                                >
                                    <Plus class="w-5 h-5" />
                                </button>
                            </div>
                            <div class="space-y-4">
                                {#each spec.risks as risk, i}
                                    <div
                                        class="group relative"
                                        transition:fly={{ x: -10 }}
                                    >
                                        <textarea
                                            bind:value={spec.risks[i]}
                                            class="w-full bg-red-500/5 border border-red-500/10 hover:border-red-500/30 rounded-2xl px-6 py-5 text-red-200/70 focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all min-h-[100px] resize-none leading-relaxed shadow-lg shadow-red-500/5"
                                            placeholder="Unknown risk..."
                                        ></textarea>
                                        <button
                                            onclick={() => removeRisk(i)}
                                            class="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-red-500 rounded-xl text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all border border-gray-700"
                                        >
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </section>
                    </div>

                    <!-- Engineering Tasks (Kanban Board) -->
                    <div class="space-y-8">
                        <div class="flex items-center justify-between">
                            <h2 class="text-3xl font-extrabold text-white">
                                Engineering Plan
                            </h2>
                        </div>

                        <div class="grid lg:grid-cols-3 gap-8">
                            {#each ["frontend", "backend", "testing"] as group}
                                {@const config = groupConfig[group]}
                                {@const tasks =
                                    group === "frontend"
                                        ? frontendTasks
                                        : group === "backend"
                                          ? backendTasks
                                          : testingTasks}

                                <div class="space-y-4">
                                    <div
                                        class="flex items-center justify-between px-2"
                                    >
                                        <div class="flex items-center gap-3">
                                            <div
                                                class={clsx(
                                                    "p-2 rounded-xl border border-gray-800",
                                                    config.bg,
                                                )}
                                            >
                                                <config.icon
                                                    class={clsx(
                                                        "w-5 h-5",
                                                        config.color,
                                                    )}
                                                />
                                            </div>
                                            <h3
                                                class="text-lg font-bold text-white tracking-wide uppercase"
                                            >
                                                {config.title}
                                            </h3>
                                            <span
                                                class="text-xs font-mono text-gray-600 bg-gray-900 px-2 py-0.5 rounded-full border border-gray-800"
                                            >
                                                {tasks.length}
                                            </span>
                                        </div>
                                        <button
                                            onclick={() => addTask(group)}
                                            class="p-2 hover:bg-gray-800 rounded-xl text-gray-500 hover:text-white transition-colors"
                                        >
                                            <Plus class="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div
                                        use:dndzone={{
                                            items: tasks,
                                            flipDurationMs,
                                            dropTargetStyle: {
                                                outline: "2px dashed #3b82f6",
                                                outlineOffset: "4px",
                                                borderRadius: "24px",
                                            },
                                        }}
                                        onconsider={(e) =>
                                            handleDnd(group, "consider", e)}
                                        onfinalize={(e) =>
                                            handleDnd(group, "finalize", e)}
                                        class="bg-gray-900/20 border border-gray-800/50 rounded-[32px] p-4 min-h-[400px] space-y-3 transition-colors hover:border-gray-800"
                                    >
                                        {#each tasks as task (task.id)}
                                            <div
                                                animate:flip={{
                                                    duration: flipDurationMs,
                                                }}
                                                class="flex flex-col bg-gray-900/60 border border-gray-800 p-5 rounded-2xl group transition-all hover:border-gray-700 hover:bg-gray-900 shadow-sm relative"
                                            >
                                                <div
                                                    class="flex items-start gap-4"
                                                >
                                                    <div
                                                        class="cursor-grab text-gray-700 group-hover:text-blue-500 transition-colors mt-1"
                                                    >
                                                        <GripVertical
                                                            class="w-5 h-5"
                                                        />
                                                    </div>

                                                    <textarea
                                                        bind:value={task.title}
                                                        class="w-full bg-transparent border-none p-0 text-md font-medium text-white focus:ring-0 placeholder-gray-700 resize-none leading-relaxed"
                                                        rows="2"
                                                        oninput={syncToSpec}
                                                    ></textarea>

                                                    <button
                                                        onclick={() =>
                                                            removeTask(task.id)}
                                                        class="p-2 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2
                                                            class="w-4 h-4"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        {:catch error}
            <div
                class="flex flex-col items-center justify-center py-32 space-y-6 text-center"
                in:fade
            >
                <div
                    class="p-6 bg-red-500/10 rounded-full border border-red-500/20 mb-4"
                >
                    <AlertCircle class="w-12 h-12 text-red-500" />
                </div>
                <h2 class="text-3xl font-bold text-white">Generation Failed</h2>
                <p class="text-gray-400 max-w-md mx-auto">{error.message}</p>
                <button
                    onclick={() => window.location.reload()}
                    class="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-2xl font-bold transition-all"
                >
                    Try Again
                </button>
            </div>
        {/await}
    </div>
</div>

<style>
    :global(body) {
        background-color: black;
    }
</style>
