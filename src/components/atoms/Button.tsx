import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'tertiary';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 font-semibold px-5 py-3.5 rounded-xl transition-all active:scale-95 text-sm md:text-base";
  
  const variants = {
    primary: "bg-[#4648d4] text-white hover:bg-[#3a3cb0] shadow-md shadow-[#4648d4]/20",
    secondary: "bg-white text-[#191c1e] border border-[#c7c4d7] hover:bg-[#f2f4f6]",
    tertiary: "bg-[#6063ee] text-white hover:bg-[#4648d4]",
    ghost: "text-[#464554] hover:bg-black/5"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}