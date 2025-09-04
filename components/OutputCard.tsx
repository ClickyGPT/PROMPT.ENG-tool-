
import React from 'react';

interface OutputCardProps {
  title: string;
  content: string;
  isLoading: boolean;
  buttons?: React.ReactNode;
  icon: React.ReactNode;
}

export const OutputCard: React.FC<OutputCardProps> = ({ title, content, isLoading, buttons, icon }) => {
  return (
    <div className="bg-pkmn-bg rounded-lg p-4 flex flex-col h-full border border-pkmn-border shadow-s1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
            {icon}
            <h3 className="text-lg font-semibold text-pkmn-blue ml-2">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
            {buttons}
        </div>
      </div>
      <div className="flex-grow bg-gray-50 text-pkmn-fg rounded-md p-3 w-full overflow-y-auto relative border border-pkmn-border">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pkmn-blue"></div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap break-words font-sans">{content || '...'}</pre>
        )}
      </div>
    </div>
  );
};
