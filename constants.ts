
import { Template, CraftComponent } from './types';

export const TEMPLATES: Template[] = [
  {
    name: 'Email Writer',
    craftState: {
      [CraftComponent.Context]: 'I need to write a professional email to a potential client I met at a networking event.',
      [CraftComponent.Role]: 'You are a friendly but professional business development manager.',
      [CraftComponent.Action]: 'Draft an email that follows up on our conversation, reminds them of my company\'s value proposition (AI-powered logistics), and asks for a 15-minute call next week.',
      [CraftComponent.Format]: 'A concise, well-formatted email with a clear subject line and call-to-action.',
      [CraftComponent.Target]: 'A busy professional who values their time and responds to clear, direct communication.',
    },
  },
  {
    name: 'Code Explainer',
    craftState: {
      [CraftComponent.Context]: 'I have a Python code snippet that uses recursion to calculate Fibonacci numbers, and I don\'t fully understand it.',
      [CraftComponent.Role]: 'You are an experienced software engineer and a great teacher who can explain complex concepts simply.',
      [CraftComponent.Action]: 'Explain the provided code snippet line by line. Describe what recursion is, how the base case works, and how the recursive step leads to the final result. Use an analogy to help with the explanation.',
      [CraftComponent.Format]: 'A clear, step-by-step explanation in markdown. Include code blocks for the relevant parts of the code you are explaining.',
      [CraftComponent.Target]: 'A junior developer who is new to the concept of recursion.',
    },
  },
  {
    name: 'Creative Story Idea Generator',
    craftState: {
      [CraftComponent.Context]: 'I am a fantasy author experiencing writer\'s block and need a unique story idea.',
      [CraftComponent.Role]: 'You are a highly imaginative muse for fantasy writers.',
      [CraftComponent.Action]: 'Generate three unique story ideas. For each idea, provide a one-paragraph synopsis, a main character concept, a central conflict, and a unique magical system.',
      [CraftComponent.Format]: 'A well-structured response with clear headings for each story idea and its components (Synopsis, Character, Conflict, Magic System).',
      [CraftComponent.Target]: 'A creative writer looking for inspiration and unique concepts that avoid common fantasy tropes.',
    },
  },
];
