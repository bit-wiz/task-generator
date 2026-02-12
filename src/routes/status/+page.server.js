import { getDbClient } from '$lib/server/db';
import { GEMINI_API_KEY } from '$env/static/private';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const load = async () => {
    const checkMongo = async () => {
        try {
            const client = await getDbClient();
            await client.db('admin').command({ ping: 1 });
            return 'ok';
        } catch (e) {
            return 'error';
        }
    };

    const checkGemini = async () => {
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent("ping");
            const response = await result.response;
            return response.text() ? 'ok' : 'error';
        } catch (e) {
            return 'error';
        }
    };

    return {
        streamed: {
            mongoStatus: checkMongo(),
            geminiStatus: checkGemini()
        }
    };
};
