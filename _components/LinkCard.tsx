"use client";

import { ExternalLink } from "lucide-react";

interface LinkCardProps {
  title: string;
  description: string;
  url: string;
  gradient: string;
}

export default function LinkCard({ title, description, url, gradient }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-gradient-to-r ${gradient} p-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-white/90 text-sm">{description}</p>
        </div>
        <ExternalLink className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
      </div>
    </a>
  );
}
