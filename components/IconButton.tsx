"use client";

import React from "react";

type IconButtonProps = {
  icon: React.ReactElement; // the icon element (no children)
  colorClass?: string; // e.g. "text-muted-foreground"
  hoverClass?: string; // e.g. "hover:text-foreground hover:bg-background"
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string; // extra wrapper classes
};

function join(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function IconButton({
  icon,
  colorClass = "text-muted-foreground",
  hoverClass = "hover:text-foreground hover:bg-background",
  onClick,
  title,
  type = "button",
  disabled = false,
  className,
}: IconButtonProps) {
  const base = "p-2 rounded-lg transition-colors flex items-center justify-center";

  // Clone the icon to ensure consistent sizing while preserving any provided classes
  const cloned = React.isValidElement(icon)
    ? React.cloneElement(icon, {
      className: join((icon.props as any)?.className, "w-5 h-5"),
      'aria-hidden': true,
    })
    : icon;

  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={join(base, colorClass, hoverClass, className)}
    >
      {cloned}
    </button>
  );
}
