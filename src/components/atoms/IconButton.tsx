import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'blur' | 'primary';
}

export default function IconButton({ 
  icon, 
  variant = 'blur', 
  className = '', 
  ...props 
}: IconButtonProps) {
  const baseStyles = "p-3 rounded-full transition-all active:scale-95 flex items-center justify-center";
  const variants = {
    blur: "bg-white/30 backdrop-blur-md text-white border border-white/20 hover:bg-white/40",
    primary: "bg-[#4648d4] text-white hover:bg-[#393bb3]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {icon}
    </button>
  );
}