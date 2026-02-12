<script>
	import "../app.css";
	import {
		Layout,
		History,
		Activity,
		PlusCircle,
		Github,
	} from "lucide-svelte";
	let { children } = $props();
</script>

<div class="min-h-screen bg-black text-gray-100 selection:bg-blue-500/30">
	<!-- Navigation -->
	<nav
		class="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-16">
				<div class="flex items-center gap-8">
					<a href="/" class="flex items-center gap-2 group">
						<div
							class="p-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors"
						>
							<Layout class="w-5 h-5 text-white" />
						</div>
						<span
							class="text-xl font-bold tracking-tight text-white"
							>TaskGen</span
						>
					</a>

					<div class="hidden md:flex items-center gap-1">
						<a
							href="/new"
							class="px-4 py-2 rounded-xl hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-2"
						>
							<PlusCircle class="w-4 h-4" />
							New Spec
						</a>
						<a
							href="/history"
							class="px-4 py-2 rounded-xl hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-2"
						>
							<History class="w-4 h-4" />
							History
						</a>
						<a
							href="/status"
							class="px-4 py-2 rounded-xl hover:bg-gray-800 text-sm font-medium transition-colors flex items-center gap-2"
						>
							<Activity class="w-4 h-4" />
							Status
						</a>
					</div>
				</div>

				<div class="flex items-center gap-4">
					<a
						href="https://github.com"
						target="_blank"
						class="text-gray-400 hover:text-white transition-colors"
					>
						<Github class="w-5 h-5" />
					</a>
					<a href="/new" class="md:hidden p-2 text-gray-400">
						<PlusCircle class="w-6 h-6" />
					</a>
				</div>
			</div>
		</div>
	</nav>

	<main>
		{@render children()}
	</main>

	<footer class="mt-20 border-t border-gray-800 py-12">
		<div class="max-w-7xl mx-auto px-4 text-center">
			<p class="text-gray-500 text-sm">
				Built with SvelteKit, MongoDB, and Google Gemini.
			</p>
		</div>
	</footer>
</div>
