<script>
    import {
        ArrowRight,
        ListChecks,
        GitBranch,
        ShieldAlert,
        Sparkles,
        LogIn,
    } from "lucide-svelte";
    import { signIn } from "@auth/sveltekit/client";
    let { data } = $props();
</script>

<div class="relative overflow-hidden pt-16 pb-32">
    <!-- Hero Background Decoration -->
    <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10"
    ></div>

    <div class="max-w-5xl mx-auto px-4 text-center">
        <h1 class="text-6xl font-extrabold tracking-tight text-white mb-6">
            Scaffold Your Features <br />
            <span
                class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400"
            >
                with AI
            </span>
        </h1>
        <p
            class="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
            Convert your feature ideas into actionable user stories, technical
            tasks, and risk assessments in seconds.
        </p>

        <div class="flex items-center justify-center gap-4">
            {#if data.session}
                <a
                    href="/new"
                    class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 group"
                >
                    Create New Spec
                    <ArrowRight
                        class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    />
                </a>
                <a
                    href="/history"
                    class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-10 rounded-2xl transition-all"
                >
                    View History
                </a>
            {:else}
                <button
                    onclick={() => signIn("google")}
                    class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 group"
                >
                    Sign in with Google
                    <LogIn
                        class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    />
                </button>
            {/if}
        </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 mt-24">
        <div class="grid md:grid-cols-4 gap-8">
            <div class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
                <div
                    class="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4"
                >
                    <Sparkles class="text-blue-400" />
                </div>
                <h3 class="text-lg font-bold text-white mb-2">Describe</h3>
                <p class="text-gray-400 text-sm">
                    Input your goal, users, and any technical constraints.
                </p>
            </div>
            <div
                class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 text-left"
            >
                <div
                    class="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4"
                >
                    <ListChecks class="text-indigo-400" />
                </div>
                <h3 class="text-lg font-bold text-white mb-2">Generate</h3>
                <p class="text-gray-400 text-sm">
                    AI generates user stories and Engineering tasks instantly.
                </p>
            </div>
            <div
                class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 text-left"
            >
                <div
                    class="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4"
                >
                    <GitBranch class="text-purple-400" />
                </div>
                <h3 class="text-lg font-bold text-white mb-2">Refine</h3>
                <p class="text-gray-400 text-sm">
                    Edit, reorder, and group tasks to fit your workflow.
                </p>
            </div>
            <div
                class="bg-gray-900/40 p-6 rounded-2xl border border-gray-800 text-left"
            >
                <div
                    class="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4"
                >
                    <ShieldAlert class="text-red-400" />
                </div>
                <h3 class="text-lg font-bold text-white mb-2">Risk Check</h3>
                <p class="text-gray-400 text-sm">
                    Get AI-driven insights on potential blockers and unknowns.
                </p>
            </div>
        </div>
    </div>
</div>
