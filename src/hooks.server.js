import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import { AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

const authHandle = SvelteKitAuth({
    providers: [
        Google({
            clientId: AUTH_GOOGLE_ID,
            clientSecret: AUTH_GOOGLE_SECRET,
        }),
    ],
    secret: AUTH_SECRET,
    trustHost: true
});

async function authorization({ event, resolve }) {
    // Protect all routes except the home page "/"
    const session = await event.locals.auth();

    if (event.url.pathname !== "/" && !session) {
        throw redirect(303, "/");
    }

    return resolve(event);
}

export const handle = sequence(authHandle.handle, authorization);
