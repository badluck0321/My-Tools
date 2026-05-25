# 🎨 My-Tools - Digital Art Gallery Platform

A modern, elegant digital art gallery platform built with React 18, Vite, Tailwind CSS, and Framer Motion. My-Tools connects artists and art enthusiasts, providing a seamless platform to discover, collect, and celebrate digital art.

## ✨ Features

### 🎭 For Users
- **Browse Gallery** - Explore curated artworks with advanced filters
- **Search & Filter** - Find art by category, price range, and artist
- **User Authentication** - Secure JWT-based login and registration
- **Favorites** - Save and manage favorite artworks
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Optimized for mobile, tablet, and desktop

### 👨‍🎨 For Artists
- **Artist Dashboard** - Manage artworks and profile
- **Upload Artworks** - Share your creations with the world
- **Artist Profiles** - Showcase your portfolio and bio

### 🎨 Design Features
- **Glassmorphism UI** - Modern glass-effect cards and components
- **Pastel Gradients** - Soft, artistic color schemes
- **Smooth Animations** - Powered by Framer Motion
- **Custom Typography** - Inter and Poppins fonts

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Django backend running on `http://localhost:8000` (optional - mock data available)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access the app**
   ```
   Open http://localhost:5173
   ```

## 🔐 Test Login Credentials

The app includes **mock authentication** for testing without a backend:

### Quick Login:
```
Email: demo@My-Tools.com
Password: Demo123!
```

### Available Test Accounts:
- **Artist**: `artist@My-Tools.com` / `Artist123!`
- **Buyer**: `buyer@My-Tools.com` / `Buyer123!`
- **Demo**: `demo@My-Tools.com` / `Demo123!`

📄 See [LOGIN_CREDENTIALS.md](./LOGIN_CREDENTIALS.md) for complete details.

**Note**: Mock authentication works automatically when the backend is not available. You can also register new accounts through the signup form.

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Reusable components
│   ├── common/       # UI components (Button, Card, Input, etc.)
│   └── layout/       # Layout components (Navbar, Footer)
├── context/          # React Context (Auth, Theme)
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── auth/         # Login, Signup
│   ├── dashboard/    # Dashboard pages
│   ├── gallery/      # Gallery pages
│   └── home/         # Landing page
├── services/         # API services
├── utils/            # Helper functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## 🎯 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔌 API Integration

The frontend connects to a Django backend at `http://localhost:8000/api/`.

### Key Endpoints
- `/auth/login/` - User login
- `/auth/register/` - User registration
- `/artworks/` - Get all artworks
- `/artists/` - Get all artists

### Authentication
JWT tokens are stored in localStorage and automatically included in API requests.

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize colors:
```js
colors: {
  primary: { ... },
  secondary: { ... },
  accent: { ... }
}
```

### Fonts
- **Inter** - Body text
- **Poppins** - Display headings

## 🌐 Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

MIT License

---

Built with ❤️ using React + Vite
