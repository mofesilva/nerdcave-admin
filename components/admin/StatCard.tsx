"use client";

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon,
  iconBgColor = "bg-orange-100",
  iconColor = "text-orange-600"
}: StatCardProps) {
  return (
    <div className="bg-zinc-300 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
          <div className={iconColor}>{icon}</div>
        </div>
        {change && (
          <span className="text-sm text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
            {change}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-black">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-base text-neutral-600 font-medium mt-1">{title}</p>
    </div>
  );
}
