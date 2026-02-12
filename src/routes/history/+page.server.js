import { getSpecsCollection } from '$lib/server/db';

export const load = async () => {

    const getSpecs = async () => {
        const specsColl = await getSpecsCollection();
        const specs = await specsColl.find()
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
