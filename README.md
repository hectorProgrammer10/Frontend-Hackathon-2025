# 🎬 MovieDB - OMDb Movie & Series Explorer

A modern, responsive web application built with Next.js 14+ and Tailwind CSS that allows users to search, explore, and save their favorite movies and TV series using the OMDb API.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0+-38bdf8?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🏠 Home Page
- **Prominent Search Bar** - Quick access to search functionality
- **Trending Movies** - Curated selection of popular films
- **Popular Series** - Featured TV shows
- **Quick Filters** - Genre-based navigation buttons
- **Modern Design** - Glassmorphism effects and gradient animations

### 🔍 Search Results Page
- **Advanced Filtering** - Filter by type (movie/series), year
- **Multiple View Modes** - Toggle between grid and list layouts
- **Pagination** - Navigate through large result sets
- **Real-time Results** - Dynamic search with loading states
- **Error Handling** - Graceful error messages and empty states

### 🎥 Movie/Series Detail Page
- **Comprehensive Information** - Plot, cast, director, ratings, and more
- **IMDb & Metascore** - Display ratings from multiple sources
- **High-Quality Poster** - Full-resolution movie artwork
- **Add to Favorites** - One-click favorite management
- **Responsive Layout** - Optimized for all screen sizes

### ❤️ Favorites Page
- **Persistent Storage** - localStorage integration
- **Quick Access** - View all saved movies and series
- **Remove Functionality** - Manage your collection
- **Empty State** - Helpful prompts for new users

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- OMDb API key (get free key at [OMDb API](http://www.omdbapi.com/apikey.aspx))

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd omdb-movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your OMDb API key:
   ```env
   NEXT_PUBLIC_OMDB_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
omdb-movie-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Home page
│   │   ├── search/
│   │   │   └── page.tsx       # Search results page
│   │   ├── movie/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Movie/Series detail page
│   │   └── favorites/
│   │       └── page.tsx       # Favorites page
│   ├── components/            # Reusable React components
│   │   ├── features/          # Feature-specific components
│   │   │   ├── SearchBar.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── ui/                # Generic UI components
│   │   │   ├── Pagination.tsx
│   │   │   └── Loading.tsx
│   │   └── layout/            # Layout components
│   │       └── Navigation.tsx
│   ├── lib/                   # Utilities and services
│   │   ├── api/
│   │   │   └── omdb.ts        # OMDb API client
│   │   ├── hooks/
│   │   │   └── index.ts       # Custom React hooks
│   │   └── utils/
│   │       └── favorites.ts   # LocalStorage utilities
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── public/                    # Static assets
└── package.json
```

## 🎨 Design Features

- **Modern Glassmorphism** - Semi-transparent elements with backdrop blur
- **Gradient Backgrounds** - Dynamic purple/pink gradients
- **Smooth Animations** - Hover effects and transitions
- **Custom Scrollbar** - Branded scrollbar design
- **Responsive Grid** - Adapts from mobile to desktop
- **Dark Theme** - Eye-friendly dark color palette
- **Google Fonts** - Inter font family for clean typography

## 🛠️ Built With

- **[Next.js 14+](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[OMDb API](http://www.omdbapi.com/)** - Movie database API
- **LocalStorage API** - Client-side data persistence

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🔑 API Usage

The application uses the OMDb API with the following endpoints:

- **Search**: `/?s={query}&type={type}&y={year}&page={page}`
- **Details**: `/?i={imdbID}&plot=full`

API key is required and should be set in `.env.local`.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Next.js and Tailwind CSS

---

**Note**: This application requires an active internet connection to fetch movie data from the OMDb API.
# Frontend-Hackathon-2025
