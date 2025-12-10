# Nerdcave Link Tree 🚀

A modern, state-of-the-art link aggregator built with Next.js 14, TypeScript, and Tailwind CSS. This app provides a beautiful, responsive interface for all your important links, inspired by Linktree and Bento.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🎨 **Modern Design**: Beautiful gradient backgrounds and glassmorphism effects
- 📱 **Fully Responsive**: Perfect on mobile, tablet, and desktop
- ⚡ **Fast Performance**: Built with Next.js for optimal speed
- 🎭 **Smooth Animations**: Engaging hover effects and transitions
- 🎯 **SEO Optimized**: Complete metadata and Open Graph support
- 🔗 **Multiple Link Types**: Support for various content categories
- 🌐 **Social Media Integration**: Connect all your social platforms
- 🎨 **Customizable**: Easy to modify colors, gradients, and content

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mofesilva/nerdcave-link-tree.git
cd nerdcave-link-tree
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Built With

- **[Next.js 14](https://nextjs.org/)** - React framework for production
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React 19](https://react.dev/)** - Latest React features

## 📝 Customization

### Updating Links

Edit the `links` array in `app/page.tsx`:

```typescript
const links = [
  {
    title: "Your Title",
    description: "Your description",
    url: "https://your-url.com",
    gradient: "from-color-500 to-color-500",
  },
  // Add more links...
];
```

### Changing Profile Information

Modify the profile section in `components/ProfileSection.tsx`:
- Update the emoji or add an image
- Change the name and title
- Edit bio text and stats

### Customizing Social Links

Edit the `socials` array in `components/SocialLinks.tsx` to add or remove social platforms.

### Styling

The color scheme and animations can be customized in:
- `app/globals.css` - Global styles
- `tailwind.config.ts` - Theme configuration

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🎨 Design Features

- **Gradient Backgrounds**: Multiple color gradients for visual appeal
- **Glassmorphism**: Modern frosted glass effect on cards
- **Hover Effects**: Interactive animations on all clickable elements
- **Responsive Grid**: Adapts beautifully to all screen sizes
- **Dark Mode**: Built-in dark theme for better accessibility

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💬 Support

For support, email contact@nerdcave.com or join our Discord community.

---

Made with ❤️ by Nerdcave