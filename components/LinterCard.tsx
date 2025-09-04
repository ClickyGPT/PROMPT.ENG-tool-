
import React, { useState } from 'react';
import { ScoreCircle } from './ScoreCircle';
import { LinterSuggestion, CraftComponent } from '../types';
import { WandIcon, CheckSquareIcon } from './icons';

interface LinterCardProps {
  score: number;
  suggestions: LinterSuggestion[];
  onFix: (component: CraftComponent, fix: string) => void;
  isLoading: boolean;
}

export const LinterCard: React.FC<LinterCardProps> = ({ score, suggestions, onFix, isLoading }) => {
  const [appliedFixIndex, setAppliedFixIndex] = useState<number | null>(null);

  const handleApplyFix = (component: CraftComponent, fix: string, index: number) => {
    onFix(component, fix);
    setAppliedFixIndex(index);
    setTimeout(() => {
      setAppliedFixIndex(null);
    }, 1500);
  };

  return (
    <div className="bg-pkmn-bg rounded-lg p-4 flex flex-col h-full border border-pkmn-border shadow-s1">
      <div className="flex items-center mb-3">
        <WandIcon className="w-6 h-6 text-pkmn-blue"/>
        <h3 className="text-lg font-semibold text-pkmn-blue ml-2">CRAFT Linter</h3>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pkmn-blue"></div>
                <p className="mt-2 text-gray-500">Analyzing...</p>
            </div>
        ) : (
            <ScoreCircle score={score} />
        )}
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        <h4 className="font-semibold mb-2 text-pkmn-fg">Suggestions:</h4>
        {isLoading ? (
            <div className="text-center text-gray-500">Waiting for analysis...</div>
        ) : suggestions.length === 0 && score > 0 ? (
          <div className="text-center text-gray-400 p-4">No suggestions. Looks great!</div>
        ) : (
          <ul className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="bg-gray-50 p-3 rounded-md border-l-4 border-pkmn-border transition-all duration-300 hover:border-pkmn-blue">
                <p className="text-sm text-gray-700 mb-2">
                  <strong className="text-pkmn-blue">{suggestion.component}:</strong> {suggestion.suggestionText}
                </p>
                {suggestion.fix && (
                  <>
                    <div className="bg-white rounded-md p-2 mt-2 border border-pkmn-border">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">Suggested Improvement:</p>
                      <blockquote className="text-sm font-mono text-pkmn-fg italic border-l-2 border-pkmn-blue pl-2">
                        {suggestion.fix}
                      </blockquote>
                    </div>
                    <button
                      onClick={() => handleApplyFix(suggestion.component, suggestion.fix, index)}
                      disabled={appliedFixIndex === index}
                      className={`mt-3 text-xs font-bold py-1 px-3 rounded inline-flex items-center transition-colors duration-200 ${
                        appliedFixIndex === index
                          ? 'bg-pkmn-yellow text-pkmn-fg cursor-not-allowed'
                          : 'bg-pkmn-blue hover:bg-pkmn-blueDark text-white'
                      }`}
                    >
                      {appliedFixIndex === index ? (
                        <CheckSquareIcon className="w-3 h-3 mr-1.5" />
                      ) : (
                        <WandIcon className="w-3 h-3 mr-1.5" />
                      )}
                      {appliedFixIndex === index ? 'Applied!' : 'Apply Fix'}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
