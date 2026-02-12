import dAdapter from '@sveltejs/adapter-node';
import vAdapter from '@sveltejs/adapter-vercel';

const adapter = process.env.PROD_TYPE === 'vercel' ? vAdapter() : dAdapter({ out: 'build' });

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter
	}
};

export default config;