import { getSpecsCollection } from '$lib/server/db';
import { ObjectId } from 'mongodb';
import { error } from '@sveltejs/kit';
import { generateSpec } from '$lib/server/gemini';

export const load = async ({ params }) => {
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

    // Function to generate and save spec
    const getAiGeneratedContent = async () => {
        if (!spec.isPending) return null;

        const generated = await generateSpec({
            goal: spec.goal,
            users: spec.users,
            constraints: spec.constraints,
            template: spec.template
        });

        const tasksWithIds = generated.tasks.map(t => ({
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
                    updatedAt: new Date()
                }
            }
        );

        return {
            userStories: generated.user_stories,
            tasks: tasksWithIds,
            risks: generated.risks
        };
    };

    return {
        spec: JSON.parse(JSON.stringify(spec)),
        streamed: {
            content: getAiGeneratedContent()
        }
    };
};

export const actions = {
    update: async ({ request, params }) => {
        const data = await request.formData();
        const updatedSpec = JSON.parse(data.get('spec'));

        const specsColl = await getSpecsCollection();
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
