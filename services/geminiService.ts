
import { GoogleGenAI, Type } from "@google/genai";
import { CraftState, LinterResponse, CraftComponent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePromptResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating prompt response:", error);
    return "An error occurred while communicating with the Gemini API. Please check the console for details.";
  }
};

export const lintPrompt = async (craftState: CraftState): Promise<LinterResponse> => {
  const systemInstruction = `You are an expert prompt engineering assistant specializing in the CRAFT framework (Context, Role, Action, Format, Target). Analyze the user's provided CRAFT components and return a JSON object with a 'score' from 0 to 100 and an array of 'suggestions'. 
  - The score should reflect the overall quality, clarity, and effectiveness of the combined prompt. 
  - Each suggestion must include: 
    1. 'component': The specific CRAFT component it applies to ('Context', 'Role', 'Action', 'Format', 'Target').
    2. 'suggestionText': A brief, actionable tip on how to improve that component.
    3. 'fix': The rewritten, improved text for that component.
  - Provide at least one suggestion for improvement unless the prompt is already perfect.
  - Be critical and provide high-quality, specific feedback. A good prompt is specific, clear, and provides all necessary information for the AI to succeed.`;

  const userPrompt = `Analyze the following CRAFT components and provide a score and suggestions for improvement:
  - Context: "${craftState.Context}"
  - Role: "${craftState.Role}"
  - Action: "${craftState.Action}"
  - Format: "${craftState.Format}"
  - Target: "${craftState.Target}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "An overall quality score from 0 to 100.",
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  component: {
                    type: Type.STRING,
                    enum: Object.values(CraftComponent),
                    description: "The CRAFT component being addressed."
                  },
                  suggestionText: {
                    type: Type.STRING,
                    description: "A brief tip for improvement."
                  },
                  fix: {
                    type: Type.STRING,
                    description: "The improved text for the component."
                  }
                },
                required: ["component", "suggestionText", "fix"]
              },
            },
          },
          required: ["score", "suggestions"]
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    // Validate the parsed response structure
    if (typeof parsedResponse.score !== 'number' || !Array.isArray(parsedResponse.suggestions)) {
        throw new Error("Invalid response format from linter API");
    }

    return parsedResponse as LinterResponse;

  } catch (error) {
    console.error("Error linting prompt:", error);
    return {
      score: 0,
      suggestions: [{
        component: CraftComponent.Context,
        suggestionText: "An error occurred during linting. Please check the console.",
        fix: ""
      }],
    };
  }
};
