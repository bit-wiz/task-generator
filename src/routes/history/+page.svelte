<script>
    import {
        Clock,
        ArrowRight,
        Calendar,
        Layers,
        Loader2,
    } from "lucide-svelte";
    let { data } = $props();
</script>

<div class="max-w-4xl mx-auto px-4 py-12">
    <div class="mb-10 flex items-center gap-3">
        <div class="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
            <Clock class="w-8 h-8" />
        </div>
        <div>
            <h1 class="text-3xl font-bold text-white">Recent Specs</h1>
            <p class="text-gray-400 text-lg">Your last 5 generated plans.</p>
        </div>
    </div>

    {#await data.streamed.specs}
        <div class="flex items-center justify-center py-32">
            <Loader2 class="w-16 h-16 text-blue-500 animate-spin" />
        </div>
    {:then specs}
        {#if specs.length === 0}
            <div
                class="bg-gray-900/40 border border-gray-800 rounded-3xl p-20 text-center"
            >
                <div
                    class="inline-flex p-6 bg-gray-800 rounded-full mb-6 text-gray-500"
                >
                    <Layers class="w-12 h-12" />
                </div>
                <h2 class="text-2xl font-bold text-white mb-4">
                    No specs found
                </h2>
                <p class="text-gray-400 mb-8 max-w-sm mx-auto">
                    You haven't generated any specs yet. Start by describing
                    your feature idea.
                </p>
                <a
                    href="/new"
                    class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2"
                >
                    Create First Spec
                    <ArrowRight class="w-5 h-5" />
                </a>
            </div>
        {:else}
            <div class="grid gap-4">
                {#each specs as spec}
                    <a
                        href="/spec/{spec._id}"
                        class="group bg-gray-900/40 border border-gray-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all flex items-center justify-between backdrop-blur-sm"
                    >
                        <div class="flex-1">
                            <h3
                                class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors"
                            >
                                {spec.goal}
                            </h3>
                            <div
                                class="flex items-center gap-4 text-sm text-gray-500"
                            >
                                <span class="flex items-center gap-1.5">
                                    <Calendar class="w-4 h-4" />
                                    {new Date(
                                        spec.createdAt,
                                    ).toLocaleDateString()}
                                </span>
                                <span
                                    class="bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-400"
                                >
                                    {spec.template}
                                </span>
                            </div>
                        </div>
                        <div
                            class="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                        >
                            <ArrowRight class="w-6 h-6" />
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    {/await}
</div>
