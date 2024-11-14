'use client'

import React from 'react';

interface SelectCryptoProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Change to HTMLSelectElement
  required?: boolean;
  error?: string;
}

const SelectCrypto: React.FC<SelectCryptoProps> = ({ label, name, value, onChange, required, error }) => {
  return (
    <div className="mb-4 p-4 bg-gray-300 rounded-md">
      <label htmlFor={name} className="block font-semibold">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={name} // Set dynamic id based on name prop
        name={name} // Set dynamic name
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full p-1 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="">選択してください</option>
        <option value="BTC">ビットコイン (BTC)</option>
        <option value="ETH">イーサリアム (ETH)</option>
        <option value="LTC">ライトコイン (LTC)</option>
      </select>
      {error && <div className="text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default SelectCrypto;