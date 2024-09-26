import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea: React.FC<TextareaProps> = ({ 
  className = '', 
  ...props 
}) => {
  return (
    <textarea 
      className={`w-full p-2 border border-gray-300 rounded-md text-black ${className}`} 
      {...props}
    />
  );
};
