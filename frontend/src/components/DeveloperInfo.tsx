import React from 'react';
import { Brain } from 'lucide-react';

export function DeveloperInfo() {
  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-white/20">
      <div className="flex items-center space-x-3">
        <Brain className="w-6 h-6 text-blue-500" />
        <div>
        </div>
      </div>
    </div>
  );
}