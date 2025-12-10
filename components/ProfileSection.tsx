"use client";

import Image from "next/image";

export default function ProfileSection() {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Profile Image */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500 ring-offset-4 ring-offset-slate-900 shadow-2xl">
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-6xl">🤓</span>
        </div>
      </div>

      {/* Name and Title */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">
          Nerdcave
        </h1>
        <p className="text-lg text-purple-300 font-medium">
          Gaming • Tech • Content Creator
        </p>
      </div>

      {/* Bio */}
      <p className="text-gray-300 max-w-md text-base leading-relaxed">
        Welcome to my corner of the internet! 🚀 I create content about gaming,
        technology, and everything in between. Join me on this adventure!
      </p>

      {/* Stats or Badges */}
      <div className="flex gap-6 mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">100K+</div>
          <div className="text-sm text-gray-400">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">500+</div>
          <div className="text-sm text-gray-400">Videos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">1M+</div>
          <div className="text-sm text-gray-400">Views</div>
        </div>
      </div>
    </div>
  );
}
