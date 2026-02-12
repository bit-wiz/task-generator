import { redirect, fail } from '@sveltejs/kit';
import { generateSpec } from '$lib/server/gemini';
import { getSpecsCollection } from '$lib/server/db';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const goal = data.get('goal');
        const users = data.get('users');
        const constraints = data.get('constraints');
        const template = data.get('template');

        if (!goal || !users) {
            return fail(400, { error: 'Goal and Users are required fields.' });
        }

        try {
            const specsColl = await getSpecsCollection();
            const newSpec = {
                goal,
                users,
                constraints,
                template,
                userStories: [],
                tasks: [],
                risks: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                isPending: true
            };

            const result = await specsColl.insertOne(newSpec);
            const insertedId = result.insertedId.toString();

            const allSpecs = await specsColl.find().sort({ createdAt: -1 }).toArray();
            if (allSpecs.length > 5) {
                const toDelete = allSpecs.slice(5);
                const deleteIds = toDelete.map(s => s._id);
                await specsColl.deleteMany({ _id: { $in: deleteIds } });
            }

            throw redirect(303, `/spec/${insertedId}`);
        } catch (error) {
            if (error.status === 303) throw error;
            console.error('Save error:', error);
            return fail(500, { error: 'Failed to save basic info. Please try again.' });
        }
    }
};
