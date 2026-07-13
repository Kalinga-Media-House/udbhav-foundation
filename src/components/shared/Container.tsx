import React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className = "",
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-12 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;
