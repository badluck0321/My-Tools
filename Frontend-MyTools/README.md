# 🔧 My-Tools - Professional Tool & Service Marketplace

A production-grade, full-stack marketplace platform where professionals discover, list, rent, and purchase tools and services — secured by enterprise authentication and built with modern web technologies.

## ✨ Features

### 🛍️ Product Marketplace
- Browse a rich catalog of professional tools and equipment
- Each product supports **multiple photos** with animated gallery, thumbnail strip, and arrow navigation
- Products are categorized by **category**, **brand/mark**, and **serie number**
- Listing types: **Sale** (`listedForId: 0`), **Rent** (`listedForId: 1`), or **Both**
- Duration tracking for rental listings (in months)
- Real-time availability status with visual badges

### 🎓 Mastery & Services
- Professionals list skills and services with title, type, pricing, description, and a cover photo
- Service types allow domain-based discovery (plumbing, electrical, welding, etc.)
- Filterable by title keyword and type ID
- Single cover photo per mastery, served through dedicated binary endpoint

### 🔍 Search & Discovery
- Full-text name search with debounced input
- Multi-dimensional filtering: category, brand, price range, availability
- Sort options: newest, price ascending/descending, alphabetical
- Client-side filter state management with one-click "Clear Filters"
- Product count display updates in real time

### 🔐 Security & Authentication
- **Keycloak SSO** — Single Sign-On with OpenID Connect & OAuth2
- **Role-Based Access Control** — four granular roles controlling read/write permissions
- **JWT Bearer validation** — every protected endpoint extracts and validates `sub` claim
- HTTP-only cookie strategy — zero token exposure in browser storage
- CORS configuration for cross-origin frontend communication

### 📖 API & Developer Tooling
- **Swagger / OpenAPI 3** — interactive docs with multipart form upload support
- **MapStruct** — compile-time DTO mappers with `@Named` qualifier to prevent field pollution
- **Structured Logging** — every request logged with username, IP, HTTP method, path, status, and duration
- **Specification Pattern** — composable MongoDB query filters with no boilerplate

### 🤖 AI Features
- **Groq LLaMA 3.3 70B** — low-latency inference via `https://api.groq.com/openai`
- AI product recommendations based on user browsing history
- Intelligent in-app assistant for Q&A, tool advice, and search help

## 🚀 Tech Stack

- **React 19** - Modern React with hooks
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Spring Boot backend running on `http://localhost:8888` (optional - mock data available)

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
   Open http://localhost:3000
   ```

## 🔐 Authentication

The app uses **Keycloak SSO** for enterprise authentication with role-based access control:

### Available Roles:
- **tools-guest** - Read-only access to listings
- **tools-basic** - Guest + likes, wishlist
- **StoreOwner** - Create and manage own listings
- **tools-admin** - Full platform management

### Test User Credentials:
```
Username: testuser
Password: testpass
Email:    test@example.com
Roles:    StoreOwner, tools-basic
```

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
│   ├── products/     # Product listing and detail pages
│   ├── masterys/     # Mastery/service listing and detail pages
│   ├── cart/         # Shopping cart pages
│   ├── forum/        # Q&A forum pages
│   ├── dashboard/    # User dashboard pages
│   └── home/         # Landing page
├── services/         # API services
│   ├── productService.js
│   ├── masteryService.js
│   ├── cartService.js
│   ├── forumService.js
│   └── authService.js
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
