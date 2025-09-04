
import React from 'react';

interface InputCardProps {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
}

export const InputCard: React.FC<InputCardProps> = ({ title, value, onChange, placeholder, icon }) => {
  return (
    <div className="bg-pkmn-bg rounded-lg p-4 flex flex-col h-full border border-pkmn-border hover:border-pkmn-blue transition-all duration-300 shadow-s1 hover:shadow-s2">
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="text-lg font-semibold text-pkmn-blue ml-2">{title}</h3>
      </div>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-grow bg-gray-50 text-pkmn-fg rounded-md p-3 w-full resize-none focus:outline-none focus:ring-2 focus:ring-pkmn-blue transition border border-pkmn-border"
      />
    </div>
  );
};
