// components/TextInput.tsx

import React from 'react';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  need?: boolean;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, name, value, onChange, required, need, error }) => {
  return (
    <div className="mb-4 p-4 bg-gray-300">
      <label htmlFor={name} className="font-bold text-[14px]">
        {label}
        {required && <span className="text-red-500 text-[10px]"> ※必須</span>}
      </label>
      <div className='flex flex-row gap-2 w-full items-center'>
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          className={`mt-1 block py-1 px-2 border border-gray-400 rounded-md ${error ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        <label>{need && <span className='text-[14px]'>権利</span>}</label>
      </div>
      {error && <div className="text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default TextInput;