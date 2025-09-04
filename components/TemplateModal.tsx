
import React, { useState } from 'react';
import { Template, CraftState } from '../types';
import { XIcon } from './icons';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSelect: (craftState: CraftState) => void;
  onSave: (name: string) => void;
  isSaveDisabled: boolean;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, templates, onSelect, onSave, isSaveDisabled }) => {
  if (!isOpen) return null;

  const [newTemplateName, setNewTemplateName] = useState('');

  const handleSave = () => {
    if (newTemplateName.trim() && !isSaveDisabled) {
      onSave(newTemplateName.trim());
      setNewTemplateName('');
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-pkmn-bg rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-pkmn-border">
        <div className="flex justify-between items-center p-4 border-b border-pkmn-border">
          <h2 className="text-xl font-bold text-pkmn-blue">Manage Templates</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-pkmn-fg">
            <XIcon className="w-6 h-6"/>
          </button>
        </div>
        
        {/* Save Section */}
        <div className="p-6 border-b border-pkmn-border">
            <h3 className="text-lg font-semibold text-pkmn-fg mb-3">Save Current Prompt as Template</h3>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Enter template name..."
                    className="flex-grow bg-gray-50 text-pkmn-fg rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pkmn-blue border border-pkmn-border disabled:opacity-50"
                    disabled={isSaveDisabled}
                />
                <button 
                    onClick={handleSave}
                    disabled={isSaveDisabled || !newTemplateName.trim()}
                    className="bg-pkmn-blue hover:bg-pkmn-blueDark text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save
                </button>
            </div>
            {isSaveDisabled && <p className="text-xs text-pkmn-red mt-2">Cannot save an empty prompt.</p>}
        </div>

        {/* Load Section */}
        <div className="p-6 overflow-y-auto">
          <h3 className="text-lg font-semibold text-pkmn-fg mb-3">Load a Template</h3>
          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.name}
                  onClick={() => {
                    onSelect(template.craftState);
                    onClose();
                  }}
                  className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-white hover:border-pkmn-blue border border-pkmn-border transition-all duration-200"
                >
                  <h3 className="font-semibold text-lg text-pkmn-blue">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.craftState.Action.substring(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-center text-gray-500">No templates found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
