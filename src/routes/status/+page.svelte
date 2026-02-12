<script>
    import {
        Activity,
        Database,
        Sparkles,
        CheckCircle2,
        XCircle,
        RefreshCw,
        Loader2,
    } from "lucide-svelte";
    import { invalidateAll } from "$app/navigation";

    let { data } = $props();
    let refreshing = $state(false);

    async function refresh() {
        refreshing = true;
        await invalidateAll();
        refreshing = false;
    }
</script>

<div class="max-w-3xl mx-auto px-4 py-12">
    <div class="mb-10 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <div class="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <Activity class="w-8 h-8" />
            </div>
            <div>
                <h1 class="text-3xl font-bold text-white">System Status</h1>
                <p class="text-gray-400 text-lg">
                    Live health check of all dependencies.
                </p>
            </div>
        </div>
        <button
            onclick={refresh}
            disabled={refreshing}
            class="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-all disabled:opacity-50"
        >
            <RefreshCw class={refreshing ? "animate-spin" : ""} />
        </button>
    </div>

    <div class="grid gap-6">
        <!-- MongoDB Backend -->
        <div
            class="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl flex items-center justify-between backdrop-blur-sm"
        >
            <div class="flex items-center gap-6">
                <div class="p-4 bg-green-500/10 rounded-2xl text-green-400">
                    <Database class="w-10 h-10" />
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white mb-1">
                        MongoDB Atlas
                    </h3>
                    <p class="text-gray-400">
                        Primary persistence store for feature specs.
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                {#await data.streamed.mongoStatus}
                    <span
                        class="text-gray-500 font-bold px-4 py-1.5 bg-gray-500/10 rounded-full flex items-center gap-2"
                    >
                        <Loader2 class="w-4 h-4 animate-spin" />
                        Checking...
                    </span>
                {:then status}
                    {#if status === "ok"}
                        <span
                            class="text-green-400 font-bold px-4 py-1.5 bg-green-500/10 rounded-full flex items-center gap-2"
                        >
                            <CheckCircle2 class="w-4 h-4" />
                            Healthy
                        </span>
                    {:else}
                        <span
                            class="text-red-400 font-bold px-4 py-1.5 bg-red-500/10 rounded-full flex items-center gap-2"
                        >
                            <XCircle class="w-4 h-4" />
                            Disconnected
                        </span>
                    {/if}
                {:catch}
                    <span
                        class="text-red-400 font-bold px-4 py-1.5 bg-red-500/10 rounded-full flex items-center gap-2"
                    >
                        <XCircle class="w-4 h-4" />
                        Error
                    </span>
                {/await}
            </div>
        </div>

        <!-- Gemini API -->
        <div
            class="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl flex items-center justify-between backdrop-blur-sm"
        >
            <div class="flex items-center gap-6">
                <div class="p-4 bg-purple-500/10 rounded-2xl text-purple-400">
                    <Sparkles class="w-10 h-10" />
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white mb-1">
                        Gemini 1.5 Flash
                    </h3>
                    <p class="text-gray-400">
                        AI powerhouse for plan generation.
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                {#await data.streamed.geminiStatus}
                    <span
                        class="text-gray-500 font-bold px-4 py-1.5 bg-gray-500/10 rounded-full flex items-center gap-2"
                    >
                        <Loader2 class="w-4 h-4 animate-spin" />
                        Checking...
                    </span>
                {:then status}
                    {#if status === "ok"}
                        <span
                            class="text-green-400 font-bold px-4 py-1.5 bg-green-500/10 rounded-full flex items-center gap-2"
                        >
                            <CheckCircle2 class="w-4 h-4" />
                            Online
                        </span>
                    {:else}
                        <span
                            class="text-red-400 font-bold px-4 py-1.5 bg-red-500/10 rounded-full flex items-center gap-2"
                        >
                            <XCircle class="w-4 h-4" />
                            Unavailable
                        </span>
                    {/if}
                {:catch}
                    <span
                        class="text-red-400 font-bold px-4 py-1.5 bg-red-500/10 rounded-full flex items-center gap-2"
                    >
                        <XCircle class="w-4 h-4" />
                        Error
                    </span>
                {/await}
            </div>
        </div>

        <!-- Backend Server -->
        <div
            class="bg-gray-900/40 border border-gray-800 p-8 rounded-3xl flex items-center justify-between backdrop-blur-sm"
        >
            <div class="flex items-center gap-6">
                <div class="p-4 bg-blue-500/10 rounded-2xl text-blue-400">
                    <Activity class="w-10 h-10" />
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white mb-1">
                        SvelteKit Server
                    </h3>
                    <p class="text-gray-400">
                        Backend API and server-side logic.
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span
                    class="text-green-400 font-bold px-4 py-1.5 bg-green-500/10 rounded-full flex items-center gap-2"
                >
                    <CheckCircle2 class="w-4 h-4" />
                    Running
                </span>
            </div>
        </div>
    </div>
</div>
