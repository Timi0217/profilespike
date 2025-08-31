import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CodeBlock({ className, children }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const language = className?.replace(/language-/, '') || 'bash';

  return (
    <div className="relative my-4 rounded-xl bg-gray-900 text-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <span className="text-gray-400 font-sans text-xs font-semibold uppercase">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8"
        >
          {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}