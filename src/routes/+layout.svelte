<script>
	import "../app.css";
	import {
		Layout,
		History,
		Activity,
		PlusCircle,
		Github,
		LogOut,
		LogIn,
	} from "lucide-svelte";
	import { signIn, signOut } from "@auth/sveltekit/client";
	let { children, data } = $props();
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

					{#if data.session}
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
					{/if}
				</div>

				<div class="flex items-center gap-4">
					{#if data.session}
						<div class="flex items-center gap-3 mr-4">
							{#if data.session.user?.image}
								<img
									src={data.session.user.image}
									alt={data.session.user?.name || "User"}
									class="w-8 h-8 rounded-full border border-gray-700"
								/>
							{/if}
							<span
								class="text-sm font-medium text-gray-300 hidden sm:inline"
								>{data.session.user?.name || "User"}</span
							>
						</div>
						<button
							onclick={() => signOut()}
							class="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
						>
							<LogOut class="w-4 h-4" />
							<span class="hidden sm:inline">Sign Out</span>
						</button>
					{:else}
						<button
							onclick={() => signIn("google")}
							class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
						>
							<LogIn class="w-4 h-4" />
							Sign In
						</button>
					{/if}
					<a
						href="https://github.com"
						target="_blank"
						class="text-gray-400 hover:text-white transition-colors ml-2"
					>
						<Github class="w-5 h-5" />
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
				Built with SvelteKit and Google Gemini.
			</p>
		</div>
	</footer>
</div>
