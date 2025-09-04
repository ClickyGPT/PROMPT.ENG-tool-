
import React, { useState, useEffect, useCallback } from 'react';
import { InputCard } from './components/InputCard';
import { OutputCard } from './components/OutputCard';
import { LinterCard } from './components/LinterCard';
import { TemplateModal } from './components/TemplateModal';
import { HistoryModal } from './components/HistoryModal';
import { generatePromptResponse, lintPrompt } from './services/geminiService';
import { CraftComponent, CraftState, LinterSuggestion, LinterResponse, HistoryItem, Template } from './types';
import { TEMPLATES } from './constants';
import { CheckSquareIcon, CopyIcon, DownloadIcon, FileTextIcon, HistoryIcon, WandIcon, ZapIcon } from './components/icons';

const initialCraftState: CraftState = {
  [CraftComponent.Context]: '',
  [CraftComponent.Role]: '',
  [CraftComponent.Action]: '',
  [CraftComponent.Format]: '',
  [CraftComponent.Target]: '',
};

const App: React.FC = () => {
  const [craftState, setCraftState] = useState<CraftState>(initialCraftState);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [linterData, setLinterData] = useState<LinterResponse>({ score: 0, suggestions: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isLinterLoading, setIsLinterLoading] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      localStorage.removeItem('promptHistory');
    }
    
    try {
      const storedTemplates = localStorage.getItem('userTemplates');
      if (storedTemplates) {
        const userTemplates = JSON.parse(storedTemplates);
        setTemplates([...TEMPLATES, ...userTemplates]);
      }
    } catch (error) {
        console.error("Failed to parse templates from localStorage", error);
        localStorage.removeItem('userTemplates');
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    try {
        setHistory(newHistory);
        localStorage.setItem('promptHistory', JSON.stringify(newHistory));
    } catch (error) {
        console.error("Failed to save history to localStorage", error);
    }
  };

  const handleCraftChange = (component: CraftComponent, value: string) => {
    setCraftState((prevState) => ({ ...prevState, [component]: value }));
  };

  const generateFullPrompt = useCallback(() => {
    const { Context, Role, Action, Format, Target } = craftState;
    if (!Context && !Role && !Action && !Format && !Target) {
      return '';
    }
    return `
### CONTEXT
${Context}

### ROLE
${Role}

### ACTION
${Action}

### FORMAT
${Format}

### TARGET
${Target}
`.trim();
  }, [craftState]);

  useEffect(() => {
    setGeneratedPrompt(generateFullPrompt());
  }, [craftState, generateFullPrompt]);
  
  const handleRunLinter = async () => {
    if (!generateFullPrompt()) return;
    setIsLinterLoading(true);
    const result = await lintPrompt(craftState);
    setLinterData(result);
    setIsLinterLoading(false);
  };

  const handleTestPrompt = async () => {
    if (!generatedPrompt) return;
    setIsLoading(true);
    setApiResponse('');
    const response = await generatePromptResponse(generatedPrompt);
    setApiResponse(response);
    setIsLoading(false);

    const newHistoryItem: HistoryItem = {
      id: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
      prompt: generatedPrompt,
      craftState,
    };
    saveHistory([newHistoryItem, ...history.slice(0, 49)]);
  };

  const handleFix = (component: CraftComponent, fix: string) => {
    handleCraftChange(component, fix);
  };
  
  const handleSelectTemplate = (templateState: CraftState) => {
    setCraftState(templateState);
  };
  
  const handleSaveTemplate = (name: string) => {
    const newTemplate: Template = { name, craftState };
    
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);

    try {
      const storedTemplates = localStorage.getItem('userTemplates');
      const userTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
      const updatedUserTemplates = [...userTemplates, newTemplate];
      localStorage.setItem('userTemplates', JSON.stringify(updatedUserTemplates));
    } catch (error) {
      console.error("Failed to save template to localStorage", error);
    }
  };

  const handleSurpriseMe = () => {
    if (templates.length === 0) return;
    const randomIndex = Math.floor(Math.random() * templates.length);
    handleSelectTemplate(templates[randomIndex].craftState);
  };
  
  const handleClearHistory = () => {
    saveHistory([]);
    setIsHistoryModalOpen(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const craftFields = [
    { id: CraftComponent.Context, placeholder: 'Provide essential background, data, or situational details. What does the AI need to know?' },
    { id: CraftComponent.Role, placeholder: 'Define the AI\'s persona. Who should it be? (e.g., "a witty historian," "a professional Python developer").' },
    { id: CraftComponent.Action, placeholder: 'Clearly state the main task. What is the AI supposed to do? (e.g., "write a blog post," "summarize this text").' },
    { id: CraftComponent.Format, placeholder: 'Specify the output structure. How should the result look? (e.g., "a bulleted list," "a JSON object with keys: name, email").' },
    { id: CraftComponent.Target, placeholder: 'Describe the intended audience. Who is this output for? (e.g., "a 5-year-old child," "a team of senior engineers").' },
  ];

  return (
    <div className="min-h-screen bg-pkmn-bg text-pkmn-fg p-4 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-outlined">
          [Gemini:BUILD]: CRAFT Prompt Builder Tool
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          CRAFT framework. Analyze, test, and refine your inputs for optimal AI prompt engineering
        </p>
      </header>
      
      <main className="flex flex-col gap-6">
        {/* Top section with Inputs and Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {craftFields.map(field => (
              <InputCard
                key={field.id}
                title={field.id}
                value={craftState[field.id]}
                onChange={(e) => handleCraftChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                icon={<div className="w-6 h-6 text-pkmn-blue font-bold text-xl flex items-center justify-center bg-blue-100 rounded-full">{field.id.charAt(0)}</div>}
              />
            ))}
          </div>
          
          {/* Right Column: Outputs and Actions */}
          <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setIsTemplateModalOpen(true)} className="bg-white border border-pkmn-border text-pkmn-fg hover:border-pkmn-blue p-3 rounded-lg flex items-center justify-center transition-all shadow-s1 hover:shadow-s2"><FileTextIcon className="w-5 h-5 mr-2" /> Templates</button>
                  <button onClick={() => setIsHistoryModalOpen(true)} className="bg-white border border-pkmn-border text-pkmn-fg hover:border-pkmn-blue p-3 rounded-lg flex items-center justify-center transition-all shadow-s1 hover:shadow-s2"><HistoryIcon className="w-5 h-5 mr-2" /> History</button>
                  <button onClick={handleSurpriseMe} className="bg-white border border-pkmn-border text-pkmn-fg hover:border-pkmn-blue p-3 rounded-lg flex items-center justify-center transition-all shadow-s1 hover:shadow-s2 col-span-2"><ZapIcon className="w-5 h-5 mr-2" /> Surprise Me!</button>
              </div>
            <div className="flex-grow min-h-[300px]">
              <OutputCard
                  title="Generated Prompt"
                  content={generatedPrompt}
                  isLoading={false}
                  icon={<WandIcon className="w-6 h-6 text-pkmn-blue"/>}
                  buttons={
                      <>
                          <button onClick={handleCopyToClipboard} className="text-gray-500 hover:text-pkmn-fg transition-colors p-1 rounded-md">
                              {copySuccess ? <CheckSquareIcon className="w-5 h-5 text-pkmn-blue" /> : <CopyIcon className="w-5 h-5" />}
                          </button>
                          <button onClick={handleDownload} className="text-gray-500 hover:text-pkmn-fg transition-colors p-1 rounded-md"><DownloadIcon className="w-5 h-5" /></button>
                      </>
                  }
              />
            </div>
            <div className="flex-grow min-h-[300px]">
               <OutputCard
                title="Gemini Response"
                content={apiResponse}
                isLoading={isLoading}
                icon={<img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Gemini" className="w-auto h-5" />}
               />
            </div>
             <button onClick={handleTestPrompt} disabled={isLoading || !generatedPrompt} className="bg-pkmn-blue hover:bg-pkmn-blueDark text-white font-bold p-3 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 shadow-s1 hover:shadow-s2">
                <ZapIcon className="w-5 h-5 mr-2" /> {isLoading ? 'Testing...' : 'Test Prompt'}
            </button>
          </div>
        </div>
        
        {/* Bottom Section: Linter */}
        <div className="flex flex-col gap-4 pt-6 mt-6 border-t border-pkmn-border">
            <button onClick={handleRunLinter} disabled={isLinterLoading} className="bg-white border border-pkmn-border text-pkmn-fg hover:border-pkmn-blue p-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 shadow-s1 hover:shadow-s2">
                <WandIcon className="w-5 h-5 mr-2" /> {isLinterLoading ? 'Analyzing...' : 'Analyze Prompt'}
            </button>
            <div className="min-h-[450px]">
              <LinterCard
                score={linterData.score}
                suggestions={linterData.suggestions}
                onFix={handleFix}
                isLoading={isLinterLoading}
              />
            </div>
        </div>
      </main>
      
      <TemplateModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={templates}
        onSelect={handleSelectTemplate}
        onSave={handleSaveTemplate}
        isSaveDisabled={!generatedPrompt}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onSelect={handleSelectTemplate}
        onClear={handleClearHistory}
      />
    </div>
  );
};

export default App;
