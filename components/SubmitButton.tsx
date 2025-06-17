import React from "react";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface SubmitButtonProps {
  isLoading?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function SubmitButton({
  isLoading,
  label,
  className,
  disabled,
  onClick,
}: SubmitButtonProps) {
  return (
    <Button
      className={`gap-2 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 min-w-[9rem] ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? (
        <div className="flex justify-center items-center w-full">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <Check className="h-5 w-5" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
