import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Generates a feature spec using Gemini AI.
 * @param {Object} params
 * @param {string} params.goal
 * @param {string} params.users
 * @param {string} params.constraints
 * @param {string} params.template
 * @returns {Promise<Object>} The generated spec JSON.
 */
export async function generateSpec({ goal, users, constraints, template }) {
    const prompt = `
Generate a feature spec for the following idea:
- Feature Goal: ${goal}
- Target Users: ${users}
- Constraints: ${constraints}
- Template Type: ${template}

Please provide the output in the following JSON format ONLY:
{
  "user_stories": ["story 1", "story 2"],
  "tasks": [
    { "title": "task 1", "group": "frontend" },
    { "title": "task 2", "group": "backend" },
    { "title": "task 3", "group": "testing" }
  ],
  "risks": ["risk 1", "risk 2"]
}

Ensure the engineering tasks are categorized into "frontend", "backend", or "testing".
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON if AI includes markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("Failed to parse AI response as JSON");
    }

    return JSON.parse(jsonMatch[0]);
}
