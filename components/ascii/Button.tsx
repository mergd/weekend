"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  icon?: string;
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  icon,
}: ButtonProps) {
  const baseClasses =
    "px-3 py-1.5 transition-all duration-200 cursor-pointer select-none text-sm";

  const variantClasses = {
    primary:
      "text-primary hover:bg-primary hover:text-primary-foreground disabled:hover:bg-transparent disabled:hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
    secondary:
      "text-secondary-foreground border border-border hover:bg-accent hover:border-border disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
    ghost:
      "hover:text-primary disabled:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      } ${className}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </button>
  );
}
