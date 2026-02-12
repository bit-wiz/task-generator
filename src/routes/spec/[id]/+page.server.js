import { getSpecsCollection } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import { error, redirect, fail } from '@sveltejs/kit';
import { generateSpecWithRetry } from '$lib/server/gemini';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals }) => {
    const session = await locals.auth();
    if (!session?.user) {
        throw redirect(303, "/");
    }
    const userId = session.user.email || 'anonymous';

    const specsColl = await getSpecsCollection();
    let spec;

    try {
        spec = await specsColl.findOne({ _id: new ObjectId(params.id) });
    } catch (e) {
        throw error(404, 'Spec not found or invalid ID');
    }

    if (!spec) {
        throw error(404, 'Spec not found');
    }

    // Ownership check
    if (spec.userId && spec.userId !== userId) {
        throw error(403, 'You do not have permission to view this spec');
    }

    // Function to generate and save spec
    const getAiGeneratedContent = async () => {
        if (!spec.isPending) return null;

        // If we are in a delayed retry state, don't trigger AI yet
        const now = new Date();
        if (spec.nextRetryAt && new Date(spec.nextRetryAt) > now) {
            return {
                isDelayed: true,
                nextRetryAt: spec.nextRetryAt
            };
        }

        try {
            const generated = await generateSpecWithRetry({
                goal: spec.goal,
                users: spec.users,
                constraints: spec.constraints,
                template: spec.template
            });

            const tasksWithIds = generated.tasks.map((/** @type {any} */ t) => ({
                ...t,
                id: Math.random().toString(36).substr(2, 9)
            }));

            // Update DB in background
            await specsColl.updateOne(
                { _id: new ObjectId(params.id) },
                {
                    $set: {
                        userStories: generated.user_stories,
                        tasks: tasksWithIds,
                        risks: generated.risks,
                        isPending: false,
                        nextRetryAt: null,
                        updatedAt: new Date()
                    }
                }
            );

            return {
                userStories: generated.user_stories,
                tasks: tasksWithIds,
                risks: generated.risks
            };
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error('Gemini all immediate retries failed, going to delayed state:', message);

            // Set next retry for 5 minutes later
            const nextRetryAt = new Date(Date.now() + 5 * 60 * 1000);

            await specsColl.updateOne(
                { _id: new ObjectId(params.id) },
                {
                    $set: {
                        nextRetryAt,
                        updatedAt: new Date()
                    }
                }
            );

            return {
                isDelayed: true,
                nextRetryAt,
                error: message
            };
        }
    };

    return {
        spec: JSON.parse(JSON.stringify(spec)),
        streamed: {
            content: getAiGeneratedContent()
        }
    };
};

/**
 * @type {import('@sveltejs/kit').Actions}
 */
export const actions = {
    update: async ({ request, params, locals }) => {
        const session = await locals.auth();
        if (!session?.user) {
            return fail(401, { error: 'Unauthorized' });
        }
        const userId = session.user.email || 'anonymous';

        const formData = await request.formData();
        const specJson = formData.get('spec');
        if (typeof specJson !== 'string') return fail(400, { error: 'Invalid spec data' });

        const updatedSpec = JSON.parse(specJson);

        const specsColl = await getSpecsCollection();

        // Ownership check before update
        const existing = await specsColl.findOne({ _id: new ObjectId(params.id) });
        if (existing && existing.userId && existing.userId !== userId) {
            return fail(403, { error: 'Forbidden' });
        }

        await specsColl.updateOne(
            { _id: new ObjectId(params.id) },
            {
                $set: {
                    userStories: updatedSpec.userStories,
                    tasks: updatedSpec.tasks,
                    risks: updatedSpec.risks,
                    updatedAt: new Date()
                }
            }
        );

        return { success: true };
    }
};
