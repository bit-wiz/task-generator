import { getSpecsCollection } from '$lib/server/db';

export const load = async () => {
    const specsColl = await getSpecsCollection();
    const specs = await specsColl.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();

    return {
        specs: JSON.parse(JSON.stringify(specs))
    };
};
