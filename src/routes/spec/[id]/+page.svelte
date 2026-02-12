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

    function handleDndConsider(e) {
        spec.tasks = e.detail.items;
    }

    function handleDndFinalize(e) {
        spec.tasks = e.detail.items;
    }

    function addTask() {
        spec.tasks = [
            ...spec.tasks,
            {
                id: Math.random().toString(36).substr(2, 9),
                title: "New task",
                group: "frontend",
            },
        ];
    }

    function removeTask(id) {
        spec.tasks = spec.tasks.filter((t) => t.id !== id);
    }

    function updateTaskGroup(id, group) {
        spec.tasks = spec.tasks.map((t) => (t.id === id ? { ...t, group } : t));
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

    const groupIcons = {
        frontend: Layout,
        backend: Server,
        testing: TestTube,
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
                <h1 class="text-4xl font-extrabold tracking-tight text-white">
                    {spec.goal}
                </h1>
                <div class="flex items-center gap-3">
                    <span
                        class="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20"
                    >
                        {spec.template}
                    </span>
                    <span
                        class="text-gray-600 text-xs font-mono uppercase tracking-widest"
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
                        Gemini is architecting...
                    </h2>
                    <p class="text-gray-500 max-w-sm">
                        Generating user stories, engineering tasks, and risk
                        assessments for your feature.
                    </p>
                </div>
            </div>
        {:then content}
            <!-- Success/Delayed State -->
            {#if content?.isDelayed}
                <!-- Patching effect doesn't work here because we use content once. Using onMount logic. -->
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
                            Gemini is currently busy. We've scheduled a
                            background retry to ensure your spec is generated.
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
                <!-- Local patch -->
                <div in:fade={{ duration: 800 }}>
                    {((spec.userStories = content.userStories),
                    (spec.tasks = content.tasks),
                    (spec.risks = content.risks),
                    (spec.isPending = false),
                    "")}
                </div>
            {/if}

            {#if !content?.isDelayed}
                <div
                    class="grid lg:grid-cols-12 gap-12"
                    in:fly={{ y: 20, duration: 600 }}
                >
                    <!-- Stories & Risks -->
                    <div class="lg:col-span-4 space-y-12">
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
                                            class="w-full bg-gray-900/50 border border-gray-800 hover:border-blue-500/30 rounded-2xl px-6 py-5 text-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all min-h-[120px] resize-none leading-relaxed"
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

                    <!-- Engineering Tasks -->
                    <div class="lg:col-span-8">
                        <section
                            class="bg-gray-900/20 border border-gray-800 rounded-[32px] p-8 md:p-12"
                        >
                            <div
                                class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
                            >
                                <h2 class="text-3xl font-extrabold text-white">
                                    Engineering Tasks
                                </h2>
                                <button
                                    onclick={addTask}
                                    class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <Plus class="w-5 h-5" />
                                    New Task
                                </button>
                            </div>

                            <div
                                use:dndzone={{
                                    items: spec.tasks,
                                    flipDurationMs,
                                }}
                                onconsider={handleDndConsider}
                                onfinalize={handleDndFinalize}
                                class="space-y-4 min-h-[400px]"
                            >
                                {#each spec.tasks as task (task.id)}
                                    <div
                                        animate:flip={{
                                            duration: flipDurationMs,
                                        }}
                                        class="flex items-center gap-6 bg-gray-900/80 border border-gray-800 p-6 rounded-2xl group transition-all hover:border-gray-600 hover:bg-gray-900 shadow-sm"
                                    >
                                        <div
                                            class="cursor-grab text-gray-600 group-hover:text-blue-400 transition-colors"
                                        >
                                            <GripVertical class="w-6 h-6 " />
                                        </div>

                                        <div class="flex-1">
                                            <input
                                                bind:value={task.title}
                                                class="w-full bg-transparent border-none p-0 text-xl font-medium text-white focus:ring-0 placeholder-gray-700"
                                                placeholder="What needs to be done?"
                                            />
                                        </div>

                                        <div class="flex items-center gap-3">
                                            <div
                                                class="flex p-1 bg-black rounded-xl border border-gray-800"
                                            >
                                                {#each ["frontend", "backend", "testing"] as group}
                                                    {@const Icon =
                                                        groupIcons[group]}
                                                    <button
                                                        onclick={() =>
                                                            updateTaskGroup(
                                                                task.id,
                                                                group,
                                                            )}
                                                        title={group
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            group.slice(1)}
                                                        class={clsx(
                                                            "p-2 rounded-lg transition-all flex items-center gap-2",
                                                            task.group === group
                                                                ? "bg-gray-800 text-blue-400 shadow-inner"
                                                                : "text-gray-600 hover:text-gray-300",
                                                        )}
                                                    >
                                                        <Icon class="w-5 h-5" />
                                                        {#if task.group === group}
                                                            <span
                                                                class="text-xs font-bold hidden md:inline"
                                                                >{group}</span
                                                            >
                                                        {/if}
                                                    </button>
                                                {/each}
                                            </div>

                                            <button
                                                onclick={() =>
                                                    removeTask(task.id)}
                                                class="p-3 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <Trash2 class="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </section>
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
                <h2 class="text-3xl font-bold text-white">
                    Geneneration Failed
                </h2>
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
