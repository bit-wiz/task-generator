import { getDbClient } from '$lib/server/db';
import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const load = async () => {
    let mongoStatus = 'checking';
    let geminiStatus = 'checking';

    // Check MongoDB
    try {
        const client = await getDbClient();
        await client.db('admin').command({ ping: 1 });
        mongoStatus = 'ok';
    } catch (e) {
        mongoStatus = 'error';
    }

    // Check Gemini API
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Minimal test call
        const result = await model.generateContent("ping");
        const response = await result.response;
        if (response.text()) {
            geminiStatus = 'ok';
        }
    } catch (e) {
        geminiStatus = 'error';
    }

    return {
        mongoStatus,
        geminiStatus
    };
};
