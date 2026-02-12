<script>
    import { enhance } from '$app/forms';
    import { Sparkles, Loader2, ArrowRight } from 'lucide-svelte';

    let { form } = $props();
    let loading = $state(false);
</script>

<div class="max-w-3xl mx-auto px-4 py-12">
    <div class="mb-10 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-white mb-4">Create New Spec</h1>
        <p class="text-gray-400 text-lg">Define your feature and let Gemini AI scaffold your plan.</p>
    </div>

    <form 
        method="POST" 
        use:enhance={() => {
            loading = true;
            return async ({ update }) => {
                loading = false;
                await update();
            };
        }}
        class="space-y-6 bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm"
    >
        {#if form?.error}
            <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {form.error}
            </div>
        {/if}

        <div class="space-y-2">
            <label for="goal" class="block text-sm font-medium text-gray-300">Feature Goal</label>
            <textarea 
                id="goal" 
                name="goal" 
                rows="3" 
                required
                placeholder="What are we building?"
                class="w-full bg-gray-800 border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            ></textarea>
        </div>

        <div class="space-y-2">
            <label for="users" class="block text-sm font-medium text-gray-300">Target Users</label>
            <textarea 
                id="users" 
                name="users" 
                rows="2" 
                required
                placeholder="Who is this for?"
                class="w-full bg-gray-800 border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            ></textarea>
        </div>

        <div class="space-y-2">
            <label for="constraints" class="block text-sm font-medium text-gray-300">Constraints / Extras (Optional)</label>
            <textarea 
                id="constraints" 
                name="constraints" 
                rows="2" 
                placeholder="Any technical constraints or specific requirements?"
                class="w-full bg-gray-800 border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            ></textarea>
        </div>

        <div class="space-y-2">
            <label for="template" class="block text-sm font-medium text-gray-300">Template</label>
            <select 
                id="template" 
                name="template" 
                class="w-full bg-gray-800 border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
            >
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Internal Tool">Internal Tool</option>
            </select>
        </div>

        <button 
            type="submit" 
            disabled={loading}
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
        >
            {#if loading}
                <Loader2 class="w-5 h-5 animate-spin" />
                Generating Plan...
            {:else}
                <Sparkles class="w-5 h-5 group-hover:scale-110 transition-transform" />
                Generate Plan
            {/if}
        </button>
    </form>
</div>
