import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-gray-200
        bg-white
        px-8
        py-16
        text-center
        ${className}
      `}
    >
      {icon && (
        <div className="mb-6 text-gray-400">
          {icon}
        </div>
      )}

      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="max-w-md text-gray-600">
        {description}
      </p>

      {action && (
        <div className="mt-8">
          {action}
        </div>
      )}
    </div>
  );
}
