import ProfileSection from "@/components/ProfileSection";
import LinkCard from "@/components/LinkCard";
import SocialLinks from "@/components/SocialLinks";

export default function Home() {
  const links = [
    {
      title: "🎮 Gaming Content",
      description: "Check out my latest gaming videos and streams",
      url: "https://youtube.com/@nerdcave",
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "💻 Tech Blog",
      description: "Articles about coding, tech reviews, and tutorials",
      url: "https://blog.nerdcave.com",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "🎙️ Podcast",
      description: "Weekly discussions on gaming and tech",
      url: "https://podcast.nerdcave.com",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      title: "🛍️ Merch Store",
      description: "Official Nerdcave merchandise",
      url: "https://store.nerdcave.com",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "📧 Newsletter",
      description: "Subscribe for weekly updates and exclusive content",
      url: "https://newsletter.nerdcave.com",
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      title: "💬 Discord Community",
      description: "Join our amazing community of nerds",
      url: "https://discord.gg/nerdcave",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-in fade-in duration-500">
          <ProfileSection />
          
          <div className="mt-8 space-y-4">
            {links.map((link, index) => (
              <div key={index}>
                <LinkCard {...link} />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <SocialLinks />
          </div>

          <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
            <p>© 2024 Nerdcave. All rights reserved.</p>
            <p className="mt-2">Built with Next.js & Tailwind CSS</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
