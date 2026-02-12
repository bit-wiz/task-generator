import { getSpecsCollection } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw redirect(303, "/");
    }
    const userId = session.user.email;

    const getSpecs = async () => {
        const specsColl = await getSpecsCollection();
        const specs = await specsColl.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .project({ _id: 1, goal: 1, template: 1, createdAt: 1 })
            .toArray();

        return JSON.parse(JSON.stringify(specs));
    };

    return {
        streamed: {
            specs: getSpecs()
        }
    };
};
