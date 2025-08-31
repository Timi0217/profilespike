import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export default function LoadingSpinner({ size = "default", text = "Loading..." }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-black`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className={`${size === 'sm' ? 'h-2 w-2' : size === 'lg' ? 'h-6 w-6' : 'h-4 w-4'} text-white animate-pulse`} />
        </div>
      </div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}