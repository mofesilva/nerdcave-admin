// Script de migração de dados para o Cappuccino Cloud Database
// Execute: node --loader ts-node/esm scripts/migrate-data.ts

import { getServerClient } from '../lib/cappuccino/server';

const initialLinks = [
  {
    title: '🎮 Gaming Content',
    description: 'Check out my latest gaming videos and streams',
    url: 'https://youtube.com/@nerdcave',
    gradient: 'from-red-500 to-pink-500',
    isActive: true,
    order: 1,
    clicks: 1250,
  },
  {
    title: '💻 Tech Blog',
    description: 'Articles about coding, tech reviews, and tutorials',
    url: 'https://blog.nerdcave.com',
    gradient: 'from-blue-500 to-cyan-500',
    isActive: true,
    order: 2,
    clicks: 890,
  },
  {
    title: '🎙️ Podcast',
    description: 'Weekly discussions on gaming and tech',
    url: 'https://podcast.nerdcave.com',
    gradient: 'from-purple-500 to-indigo-500',
    isActive: true,
    order: 3,
    clicks: 645,
  },
  {
    title: '🛍️ Merch Store',
    description: 'Official Nerdcave merchandise',
    url: 'https://store.nerdcave.com',
    gradient: 'from-green-500 to-emerald-500',
    isActive: true,
    order: 4,
    clicks: 523,
  },
  {
    title: '📧 Newsletter',
    description: 'Subscribe for weekly updates and exclusive content',
    url: 'https://newsletter.nerdcave.com',
    gradient: 'from-orange-500 to-yellow-500',
    isActive: true,
    order: 5,
    clicks: 412,
  },
  {
    title: '💬 Discord Community',
    description: 'Join our amazing community of nerds',
    url: 'https://discord.gg/nerdcave',
    gradient: 'from-violet-500 to-purple-500',
    isActive: true,
    order: 6,
    clicks: 1580,
  },
];

const initialSocialLinks = [
  { platform: 'Twitter', url: 'https://twitter.com/nerdcave', isActive: true, order: 1 },
  { platform: 'YouTube', url: 'https://youtube.com/@nerdcave', isActive: true, order: 2 },
  { platform: 'GitHub', url: 'https://github.com/nerdcave', isActive: true, order: 3 },
  { platform: 'Instagram', url: 'https://instagram.com/nerdcave', isActive: true, order: 4 },
  { platform: 'Twitch', url: 'https://twitch.tv/nerdcave', isActive: true, order: 5 },
  { platform: 'Discord', url: 'https://discord.gg/nerdcave', isActive: true, order: 6 },
];

const initialProfile = {
  name: 'Nerdcave',
  title: 'Gaming • Tech • Content Creator',
  bio: 'Welcome to my corner of the internet! 🚀 I create content about gaming, technology, and everything in between. Join me on this adventure!',
  followers: 100000,
  videos: 500,
  views: 1000000,
};

async function migrate() {
  console.log('🚀 Iniciando migração de dados para o Cappuccino...\n');

  try {
    const { apiClient } = await getServerClient();

    // Migrar Links
    console.log('📝 Migrando links...');
    for (const link of initialLinks) {
      const now = new Date();
      await apiClient.request('/collections/links', {
        method: 'POST',
        body: JSON.stringify({
          ...link,
          createdAt: now,
          updatedAt: now,
        })
      });
      console.log(`  ✓ Criado: ${link.title}`);
    }

    // Migrar Social Links
    console.log('\n🔗 Migrando social links...');
    for (const social of initialSocialLinks) {
      await apiClient.request('/collections/social_links', {
        method: 'POST',
        body: JSON.stringify(social)
      });
      console.log(`  ✓ Criado: ${social.platform}`);
    }

    // Migrar Profile
    console.log('\n👤 Migrando profile...');
    await apiClient.request('/collections/profile', {
      method: 'POST',
      body: JSON.stringify({
        ...initialProfile,
        updatedAt: new Date(),
      })
    });
    console.log(`  ✓ Profile criado: ${initialProfile.name}`);

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`  - ${initialLinks.length} links criados`);
    console.log(`  - ${initialSocialLinks.length} social links criados`);
    console.log(`  - 1 profile criado`);
  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

migrate();
