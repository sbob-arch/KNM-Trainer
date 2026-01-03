import React, { useState } from 'react';
import { Key } from 'lucide-react';

const ApiKeyScreen: React.FC<{ onSave: (key: string) => void }> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full">
            <Key className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome to KNM Trainer</h1>
        <p className="text-center text-slate-500 mb-6">
          To generate unlimited practice exams, please enter your free Google Gemini API Key.
        </p>
        
        <input
          type="password"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Paste your API Key here"
          className="w-full p-4 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-mono text-sm mb-4"
        />

        <button
          onClick={() => onSave(inputKey)}
          disabled={!inputKey.trim()}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Practicing
        </button>
        
        <div className="mt-6 text-xs text-center text-slate-400">
          <p>Don't have a key?</p>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline font-medium"
          >
            Get a free Gemini API Key here
          </a>
          <p className="mt-2">Your key is stored locally in your browser and never sent to our servers.</p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyScreen;