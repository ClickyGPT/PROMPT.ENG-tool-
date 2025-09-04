
import React from 'react';
import { HistoryItem, CraftState } from '../types';
import { XIcon } from './icons';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (craftState: CraftState) => void;
  onClear: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-pkmn-bg rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-pkmn-border">
        <div className="flex justify-between items-center p-4 border-b border-pkmn-border">
          <h2 className="text-xl font-bold text-pkmn-blue">Prompt History</h2>
           <div className="flex items-center space-x-4">
            <button onClick={onClear} className="text-sm bg-pkmn-red hover:bg-opacity-80 text-white font-bold py-1 px-3 rounded transition-colors">
              Clear History
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-pkmn-fg">
                <XIcon className="w-6 h-6"/>
            </button>
           </div>
        </div>
        <div className="p-6 overflow-y-auto">
          {history.length > 0 ? (
            <ul className="space-y-3">
              {history.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    onSelect(item.craftState);
                    onClose();
                  }}
                  className="bg-gray-50 border border-pkmn-border p-4 rounded-lg cursor-pointer hover:bg-white hover:border-pkmn-blue transition-colors duration-200"
                >
                  <p className="font-semibold text-pkmn-fg truncate">{item.prompt}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No history yet. Test a prompt to save it.</p>
          )}
        </div>
      </div>
    </div>
  );
};
