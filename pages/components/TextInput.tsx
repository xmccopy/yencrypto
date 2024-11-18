// components/TextInput.tsx

import React from "react";

interface TextInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  need?: boolean;
  error?: string;
  type?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  required,
  need,
  error,
  type = "text",
}) => {
  return (
    <div className="px-[32px] py-[24px] bg-[#F3F3F3] rounded-[16px]">
      <label htmlFor={name} className="font-bold text-[14px] text-[#212121]">
        {label}
        {required && <span className="text-red-500 text-[10px]"> ※必須</span>}
      </label>
      <div className="flex flex-row gap-2 w-full items-center">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`mt-1 block py-1 w-full px-2  text-[#212121] bg-[#FEFEFE] rounded-lg ${
            error ? "border border-red-500" : "border border-[#185F03]"
          }`}
        />
        {need && (
          <label className="w-[35px]">
            <span className="text-[14px] text-[#212121]">権利</span>
          </label>
        )}
      </div>
      {error && <div className="text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default TextInput;
