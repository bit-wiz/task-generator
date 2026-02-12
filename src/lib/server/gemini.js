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

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI response as JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

/**
 * Generates spec with automatic immediate retries.
 * @param {Object} params
 */
export async function generateSpecWithRetry(params, maxRetries = 3) {
  let lastError = new Error("Unknown error");
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await generateSpec(params);
    } catch (error) {
      if (error instanceof Error) {
        lastError = error;
        console.error(`Gemini attempt ${i + 1} failed:`, error.message);
      } else {
        lastError = new Error(String(error));
      }

      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}
