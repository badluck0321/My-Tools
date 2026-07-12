<div align="center">

<img src="https://raw.githubusercontent.com/badluck0321/My-Tools/main/Frontend-MyTools/public/logo.png" alt="My-Tools Logo" width="120" height="120" onerror="this.style.display='none'"/>

# 🔧 My-Tools

### *The Professional Tool & Service Marketplace*

> A production-grade, full-stack marketplace platform where professionals discover, list, rent, and purchase tools and services — secured by enterprise authentication and built with modern web technologies.

<br/>

[![Java](https://img.shields.io/badge/Java-21+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Keycloak](https://img.shields.io/badge/Keycloak-21+-4D4D4D?style=for-the-badge&logo=keycloak&logoColor=white)](https://www.keycloak.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

[![GitHub stars](https://img.shields.io/github/stars/badluck0321/My-Tools?style=social)](https://github.com/badluck0321/My-Tools/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/badluck0321/My-Tools?style=social)](https://github.com/badluck0321/My-Tools/network)
[![GitHub commits](https://img.shields.io/github/commit-activity/m/badluck0321/My-Tools?style=social)](https://github.com/badluck0321/My-Tools/commits/main)

<br/>

**[🚀 Live Demo](#)** · **[📖 API Docs](http://localhost:8888/swagger-ui/index.html)** · **[🐛 Report Bug](https://github.com/badluck0321/My-Tools/issues)** · **[💡 Request Feature](https://github.com/badluck0321/My-Tools/issues)**

<br/>

---

### Navigation

[📋 Overview](#-overview) · [✨ Features](#-features) · [🏗️ Architecture](#️-architecture) · [📁 Project Structure](#-project-structure) · [🚀 Getting Started](#-getting-started) · [📡 API Reference](#-api-reference) · [🔐 Security](#-security-model) · [🤖 AI Integration](#-ai-integration) · [🐳 Docker](#-docker-deployment) · [🗺️ Roadmap](#️-roadmap) · [🤝 Contributing](#-contributing)

</div>

---

## 📋 Overview

**My-Tools** is a comprehensive, production-ready marketplace platform designed for professionals in the trades and services industry. Whether you're a contractor looking to rent specialized equipment, a craftsman showcasing your skills, or a business managing tool inventory — My-Tools provides a secure, scalable, and intuitive platform to connect supply with demand.

The application is engineered with a clean separation of concerns across two independent modules:

| Module | Technology | Responsibility |
|--------|-----------|----------------|
| **`BackEnd-MyTools`** | Spring Boot 3.3.4 + Java 21 | REST API, business logic, data persistence, security |
| **`Frontend-MyTools`** | React 19 + Vite 7 + Tailwind 3 | UI, client routing, state management, API consumption |

### What Makes My-Tools Different

- **GridFS Binary Storage** — Photos aren't stored as base64 or file paths; they live as binary streams in MongoDB GridFS, served through authenticated endpoints and fetched as blob URLs in the frontend
- **Zero Token Exposure** — The frontend never holds tokens in localStorage; authentication flows entirely through Keycloak with server-side JWT validation on every API call
- **Dynamic URL Mapping** — MapStruct mappers transform raw MongoDB `ObjectId` photo references into fully qualified HTTP URLs at the DTO layer before responses leave the server
- **Specification-Based Filtering** — Products and masteries support runtime query composition (category, mark, price, availability, name) without a single hand-written JPQL query
- **AI-Augmented UX** — Groq's LLaMA 3.3 70B powers intelligent product recommendations and an in-app assistant, integrated directly into the React frontend

### Presentation-Ready Stabilization

The project has been hardened for demo and presentation use without introducing new features. The current state focuses on reliability, consistency, and polish:

**Backend Core Services Stabilized:**
- **GlobalExceptionHandler** and **RequestLoggingFilter** now use resilient object-provider access instead of hard dependencies, preventing startup failures when logging services are unavailable
- **BookingService** logic was hardened with robust repository data retrieval, consistent booking sorting, and fallback behavior when profile data is missing
- **MasteryService** update logic was aligned with business rules, preserving existing photo URLs unless explicitly updated and enforcing single-mastery policy for craftsmen
- All backend tests now pass (26/26) with zero failures, confirming stable service behavior

**Frontend Quality Polished:**
- Production build verified successfully with Vite 7.x
- Lint warnings reduced to non-blocking levels (56 warnings vs 58 errors previously)
- Unused imports and variables cleaned up across common components, pages, and services
- React hook dependency warnings addressed to improve runtime stability

**Documentation Refreshed:**
- Updated stack versions to reflect current production-ready versions (Java 21, Spring Boot 3.3.4, React 19, Vite 7.x, MongoDB 7.x)
- Added comprehensive stabilization section documenting the reliability improvements
- Enhanced architecture diagrams and request lifecycle documentation
- Updated getting started guide with current environment requirements

The application is now production-ready for demonstration and presentation without any new functionality added.

---

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

### 🖼️ Photo Management
- **MongoDB GridFS** stores binary image data with content-type metadata
- Photos referenced by `ObjectId` in documents, resolved to URLs at the mapper layer
- Frontend fetches images as **Blob URLs** through the service layer (never hardcoded paths)
- Automatic memory management — `URL.revokeObjectURL()` called on component unmount

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

---

## 🏗️ Architecture

### System Overview

```
╔══════════════════════════════════════════════════════════════════════════╗
║                           MY-TOOLS PLATFORM                             ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║   ┌─────────────────────────────────────────────────────────────────┐   ║
║   │                    PRESENTATION LAYER                           │   ║
║   │                                                                 │   ║
║   │   React 18 + Vite   │   Tailwind CSS   │   Framer Motion        │   ║
║   │   React Router v6   │   Lucide Icons   │   Axios Interceptors   │   ║
║   │                                                                 │   ║
║   │   Pages: ProductsIndex · ProductDetail · MasteryIndex          │   ║
║   │   Services: productService · masteryService · photoService      │   ║
║   │   Components: ProductCard · ArtworkCard · Input · Button        │   ║
║   │                                                                 │   ║
║   └──────────────────────────┬──────────────────────────────────────┘   ║
║                              │                                           ║
║                              │  HTTP/REST + JWT Bearer Token             ║
║                              │                                           ║
║   ┌──────────────────────────▼──────────────────────────────────────┐   ║
║   │                      API GATEWAY LAYER                          │   ║
║   │                                                                 │   ║
║   │              Spring Boot 3.3.4  (Port 8888)                    │   ║
║   │                                                                 │   ║
║   │  ┌─────────────────┐  ┌────────────────┐  ┌─────────────────┐  │   ║
║   │  │ProductController│  │MasteryController│  │  PhotoService   │  │   ║
║   │  │  GET  /products │  │ GET  /masterys │  │  GridFS save    │  │   ║
║   │  │  POST /products │  │ POST /masterys │  │  GridFS fetch   │  │   ║
║   │  │  GET  /photos   │  │ GET  /photo    │  │  ObjectId→URL   │  │   ║
║   │  └────────┬────────┘  └───────┬────────┘  └────────┬────────┘  │   ║
║   │           │                   │                     │           │   ║
║   │  ┌────────▼───────────────────▼─────────────────────▼────────┐  │   ║
║   │  │              SERVICE + MAPPER LAYER                       │  │   ║
║   │  │  ProductService · MasteryService · ProductMapper          │  │   ║
║   │  │  MasteryMapper (@Named) · Specification Filters           │  │   ║
║   │  └──────────────────────────────┬────────────────────────────┘  │   ║
║   └─────────────────────────────────┼───────────────────────────────┘   ║
║                                     │                                    ║
║   ┌─────────────────────────────────┼───────────────────────────────┐   ║
║   │            INFRASTRUCTURE LAYER │                               │   ║
║   │                                 │                               │   ║
║   │   ┌─────────────────────────────▼────────────────────────────┐ │   ║
║   │   │                      MongoDB                             │ │   ║
║   │   │  Collection: Product  │  Collection: Service (Mastery)   │ │   ║
║   │   │  Collection: fs.files │  Collection: fs.chunks           │ │   ║
║   │   │          (GridFS binary photo storage)                   │ │   ║
║   │   └──────────────────────────────────────────────────────────┘ │   ║
║   │                                                                 │   ║
║   │   ┌───────────────────────────────────────────────────────────┐│   ║
║   │   │                  Keycloak (Port 8080)                     ││   ║
║   │   │  Realm: myrealm │ Client: my-api │ Client: frontend       ││   ║
║   │   │  Roles: StoreOwner · tools-admin · tools-basic · guest    ││   ║
║   │   │  JWT Claims: sub · realm_access · resource_access         ││   ║
║   │   └───────────────────────────────────────────────────────────┘│   ║
║   └─────────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════════════════╝
```

### Request Lifecycle

```
User Action (click "Add Product")
        │
        ▼
React Component (ProductsIndex)
        │  calls
        ▼
productService.getProduct()           ← Axios + interceptor (injects JWT)
        │  HTTP GET /products?filters
        ▼
Spring Security Filter Chain          ← validates JWT Bearer token
        │  extracts sub, roles
        ▼
ProductController.getAllProductsSpect()
        │  passes categoryId, markId, available, name
        ▼
ProductService.getAllProductsSpecs()   ← builds Specification query
        │  returns List<Product>
        ▼
ProductMapper.toDtoList()             ← MapStruct maps each product
        │  photoIds → full URLs (baseUrl + /products/photos/ + id)
        ▼
ResponseEntity<List<DtoGetProduct>>
        │  JSON response
        ▼
React state: setProducts(data)
        │
        ▼
ProductCard × N rendered in grid      ← click → navigate(/products/:id)
        │
        ▼
ProductDetail page loads
        │  calls productService.getProductById(id)
        │  calls productService.getProductPhoto(photoId) → Blob URL
        ▼
Gallery component renders with blob URLs
```

### Photo Storage Flow

```
Upload (POST /products)                    Retrieve (GET /products/photos/:id)
─────────────────────────                 ──────────────────────────────────
MultipartFile (browser)                   ObjectId (from product.photoIds)
        │                                         │
        ▼                                         ▼
photoService.savePhoto(file)              photoService.getPhoto(id)
        │                                         │
        ▼                                         ▼
gridFsTemplate.store(                     gridFsTemplate.findOne(
  inputStream,                              Query(Criteria._id = ObjectId)
  filename,                               )
  contentType                             │
)                                         ▼
        │                               gridFsTemplate.getResource(file)
        ▼                                         │
  ObjectId returned                              ▼
        │                               ByteArrayOutputStream → byte[]
        ▼                                         │
product.setPhotoIds([id])                         ▼
        │                               ResponseEntity<byte[]>
        ▼                                 Content-Type: image/jpeg
Saved to fs.files + fs.chunks                     │
                                                  ▼
                                       Frontend: URL.createObjectURL(blob)
```

---

## 📁 Project Structure

### Backend — `BackEnd-MyTools/`

```
BackEnd-MyTools/
├── src/main/java/com/example/BackEnd_MyTools/
│   │
│   ├── Controllers/
│   │   ├── ProductController.java
│   │   │     • GET  /products              → filtered listing with specs
│   │   │     • GET  /products/{id}         → single product by ID
│   │   │     • POST /products              → multipart: JSON + List<photo>
│   │   │     • GET  /products/photos/{id}  → binary image response
│   │   │
│   │   └── MasteryController.java
│   │         • GET  /masterys/specials     → filtered mastery listing
│   │         • POST /masterys              → multipart: JSON string + photo
│   │         • GET  /masterys/photo/{id}   → binary image response
│   │
│   ├── Entitys/
│   │   ├── Product.java
│   │   │     @Document(collection = "Product")
│   │   │     Fields: id, name, categoryId, markId, serieNum,
│   │   │             description, price, listedForId, duration,
│   │   │             photoIds (List<String>), ownerId, isavailable
│   │   │
│   │   └── Mastery.java
│   │         @Document(collection = "Service")
│   │         Fields: id, masterId, title, typeId, price,
│   │                 description, photoId (String)
│   │
│   ├── DTO/
│   │   ├── DtoGetProduct.java
│   │   │     Same fields as Product; photoIds contains full URLs
│   │   │
│   │   └── DtoGetMastery.java
│   │         Same fields as Mastery; photoId contains full URL
│   │
│   ├── Mapper/
│   │   ├── ProductMapper.java
│   │   │     @Mapper(componentModel = "spring")
│   │   │     toDto(Product, @Context String baseUrl)
│   │   │     toDtoList(List<Product>, @Context String baseUrl)
│   │   │     mapPhotoUrls(): List<String> → List<URL>
│   │   │     (no @Named needed — List<String> is unambiguous)
│   │   │
│   │   └── MasteryMapper.java
│   │         @Mapper(componentModel = "spring")
│   │         toDto(Mastery, @Context String baseUrl)
│   │         toDtoList(List<Mastery>, @Context String baseUrl)
│   │         @Named("mapPhotoUrl") — prevents all-String-field pollution
│   │         qualifiedByName = "mapPhotoUrl" on photoId @Mapping
│   │
│   ├── Services/
│   │   ├── ProductService.java
│   │   │     getAllProductsSpecs(categoryId, markId, available, name)
│   │   │     createProduct(Product)
│   │   │     getProductById(id)
│   │   │
│   │   ├── MasteryService.java
│   │   │     getAllMasterysSpecs(title, typeId)
│   │   │     createMastery(Mastery)
│   │   │
│   │   └── PhotoService.java
│   │         savePhoto(MultipartFile) → String (GridFS ObjectId)
│   │         getPhoto(id) → Optional<PhotoData>
│   │         record PhotoData(byte[] bytes, String contentType)
│   │
│   └── Config/
│       └── SecurityConfig.java
│             JWT issuer URI configuration
│             CORS policy
│             Route-level authorization rules
│
└── pom.xml
      Key dependencies:
      • spring-boot-starter-web
      • spring-boot-starter-data-mongodb
      • spring-boot-starter-security
      • spring-boot-starter-oauth2-resource-server
      • mapstruct + mapstruct-processor
      • springdoc-openapi-starter-webmvc-ui (Swagger)
      • itext7 + itext7.bouncy-castle-adapter (PDF)
      • jackson-databind (ObjectMapper for multipart JSON)
```

### Frontend — `Frontend-MyTools/`

```
Frontend-MyTools/
├── src/
│   ├── pages/
│   │   ├── products/
│   │   │   ├── ProductsIndex.jsx
│   │   │   │     State: products, loading, searchTerm, selectedCategory,
│   │   │   │            selectedPriceRange, selectedSort, likedProducts
│   │   │   │     Features: search, category filter, price filter,
│   │   │   │               sort, like toggle, grid layout
│   │   │   │
│   │   │   └── ProductDetail.jsx
│   │   │         State: product, loading, error, isLiked
│   │   │         Components: Gallery (multi-photo with animation),
│   │   │                     PhotoImage (blob URL fetching),
│   │   │                     Badge, InfoRow, action buttons
│   │   │         Memory: URL.revokeObjectURL() on unmount
│   │   │
│   │   └── masteries/
│   │       └── (mastery listing and detail pages)
│   │
│   ├── components/
│   │   └── common/
│   │       ├── ProductCard.jsx     → onClick → navigate(/products/:id)
│   │       ├── ArtworkCard.jsx     → alternative card variant
│   │       ├── Input.jsx           → search input with icon slot
│   │       ├── Button.jsx          → variants: outline, ghost, primary
│   │       └── Loading.jsx         → spinner with text prop
│   │
│   ├── services/
│   │   └── productService.js
│   │         getProduct()             → GET /products
│   │         getProductById(id)       → GET /products/:id
│   │         getProductPhoto(photoId) → GET /products/photos/:id
│   │                                    responseType: 'blob'
│   │                                    returns URL.createObjectURL(blob)
│   │
│   └── utils/
│       └── constants.js
│             ART_CATEGORIES   [{id, name, icon}]
│             PRICE_RANGES     [{id, label, min, max}]
│             SORT_OPTIONS     [{id, label}]
│
├── tailwind.config.js          → custom warm color palette, dark mode
├── vite.config.js              → dev proxy, path aliases
└── package.json
      Key dependencies:
      • react 18, react-dom, react-router-dom v6
      • framer-motion (page + gallery animations)
      • lucide-react (icon library)
      • axios (HTTP client with interceptors)
      • tailwindcss + autoprefixer
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version | Check Command |
|------|----------------|---------------|
| Java JDK | 17 | `java -version` |
| Apache Maven | 3.8+ | `mvn -version` |
| Node.js | 18+ | `node -version` |
| npm | 9+ | `npm -version` |
| MongoDB | 6.x | `mongod --version` |
| Keycloak | 21+ | `kc.sh --version` |
| Docker (optional) | 20+ | `docker -version` |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/badluck0321/My-Tools.git
cd My-Tools
```

---

### Step 2 — Start MongoDB

```bash
# Local installation
mongod --dbpath /data/db

# Or via Docker without the docker compose
docker run -d \
  --name mytools-mongodb \
  --restart unless-stopped \
  --network mytools-network \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  mongo:7.0
```

---

### Step 3 — Configure & Start Keycloak

```bash
# Via Docker (recommended) without the docker compose
docker run -d \
  --name mytools-keycloak \
  --restart unless-stopped \
  --network mytools-network \
  -p 8080:8080 \
  -v keycloak-data:/opt/keycloak/data \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.4.5 \
  start-dev
```

Open `http://localhost:8080/admin` and complete the setup:

**Realm**
```
Name: myrealm
```

**Clients**

| Client ID | Type | Valid Redirect URIs | Web Origins |
|-----------|------|---------------------|-------------|
| `frontend-mytools` | Public | `http://localhost:3000/*` | `http://localhost:3000` |
| `my-api` | Confidential | — | — |

**Roles** (create under `my-api` → Roles)

| Role | Description |
|------|-------------|
| `tools-guest` | Read-only access to listings |
| `tools-basic` | Guest + likes, wishlist |
| `StoreOwner` | Create and manage own listings |
| `tools-admin` | Full platform management |

**Test User**
```
Username: testuser
Password: testpass
Email:    test@example.com
Roles:    StoreOwner, tools-basic
```

---

### Step 4 — Backend Configuration & Launch

```bash
cd BackEnd-MyTools
```

Edit `src/main/resources/application.properties`:

```properties
# ─── Server ─────────────────────────────────────────────
server.port=8888

# ─── MongoDB ────────────────────────────────────────────
spring.data.mongodb.uri=mongodb://localhost:27017/mytoolsdb
spring.data.mongodb.database=mytoolsdb

# ─── Keycloak / OAuth2 ──────────────────────────────────
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8080/realms/myrealm
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8080/realms/myrealm/protocol/openid-connect/certs

# ─── Swagger ────────────────────────────────────────────
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

```bash
# Build and run
./mvnw clean install -DskipTests
./mvnw spring-boot:run

# Verify health
curl http://localhost:8888/actuator/health
# → {"status":"UP"}

# Open Swagger UI
open http://localhost:8888/swagger-ui/index.html
```

---

### Step 5 — Frontend Configuration & Launch

```bash
cd ../Frontend-MyTools
npm install
```

Create `.env.local`:

```env
# ─── API ─────────────────────────────────────────────────
VITE_API_BASE_URL=http://localhost:8888

# ─── Keycloak ────────────────────────────────────────────
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=myrealm
VITE_KEYCLOAK_CLIENT_ID=frontend-mytools

# ─── AI (Groq) ───────────────────────────────────────────
# Development only — never commit this value
VITE_GROQ_API_KEY=your_groq_api_key_here
```

```bash
npm run dev
# → http://localhost:3000
```

---

### Step 6 — Seed the Database (Optional)

Populate 30 realistic products across 8 professional categories:

```bash
mongosh mytoolsdb seed_products.js
# → ✅ Inserted 30 products.
```

**Seeded categories:**

| Category ID | Category | Example Products |
|-------------|----------|-----------------|
| `1` | Electrical | Wire Stripper, Cable Tester, Extension Reel |
| `2` | Hand Tools | Hammer, Wrenches, Screwdrivers, Pliers |
| `3` | Garden | Lawn Mower, Hedge Trimmer, Pressure Washer |
| `4` | Plumbing | Pipe Wrench, Pipe Cutter, Drain Snake |
| `5` | Measuring | Laser Level, Multimeter, Stud Finder |
| `6` | Storage/Safety | Tool Chest, Tool Bag, Helmet, Goggles |
| `8` | Power Tools | Drill, Grinder, Circular Saw, Jigsaw |
| `9` | Welding | MIG Welder, Auto-Darkening Helmet, Plasma Cutter |

---

## 📡 API Reference

### Base URL
```
http://localhost:8888
```

### Authentication Header
```http
Authorization: Bearer <KEYCLOAK_JWT_TOKEN>
```

---

### 📦 Products

#### `GET /products` — List products with optional filters

```http
GET /products?categoryId=8&markId=19&available=true&name=drill
```

| Query Param | Type | Required | Description |
|-------------|------|----------|-------------|
| `categoryId` | `Integer` | No | Filter by category |
| `markId` | `Integer` | No | Filter by brand/mark |
| `available` | `Boolean` | No | Only available listings |
| `name` | `String` | No | Partial name search |

**Response `200 OK`:**
```json
[
  {
    "id": "product_1",
    "name": "Cordless Drill",
    "categoryId": 8,
    "markId": 19,
    "serieNum": 1001,
    "description": "Powerful 18V cordless drill with 2-speed gearbox",
    "price": "129.99",
    "listedForId": 0,
    "duration": 0,
    "isavailable": true,
    "photoIds": [
      "http://localhost:8888/products/photos/69dcbedfe19e2b5563b17d8f",
      "http://localhost:8888/products/photos/69dcbedfe19e2b5563b17d91"
    ]
  }
]
```

**`listedForId` values:**

| Value | Meaning | Button Label |
|-------|---------|-------------|
| `0` | For Sale | "Add to Cart" |
| `1` | For Rent | "Rent Now" |
| `30` | Both | "Add to Cart" |

---

#### `GET /products/{id}` — Get single product

```http
GET /products/product_1
```

**Response `200 OK`:**
```json
{
  "id": "product_1",
  "name": "Cordless Drill",
  "categoryId": 8,
  "markId": 19,
  "serieNum": 1001,
  "description": "Powerful 18V cordless drill with 2-speed gearbox",
  "price": "129.99",
  "listedForId": 0,
  "duration": 0,
  "photoIds": ["69dcbedfe19e2b5563b17d8f"],
  "ownerId": null,
  "isavailable": true
}
```

---

#### `POST /products` — Create product with photos *(🔒 StoreOwner)*

```http
POST /products
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

| Part | Type | Required | Description |
|------|------|----------|-------------|
| `product` | `String` (JSON) | ✅ | Product data as raw JSON string |
| `photos` | `File` (binary) | ❌ | One or more image files |

**`product` JSON payload:**
```json
{
  "name": "Cordless Drill Pro",
  "categoryId": 8,
  "markId": 19,
  "serieNum": 8451,
  "description": "Professional 18V drill with 2-speed gearbox",
  "price": 150.99,
  "listedForId": 0,
  "duration": 12,
  "isavailable": true
}
```

> ⚠️ **Important:** The `product` part must be a raw JSON string with no surrounding quotes. The backend uses `ObjectMapper.readValue()` for deserialization — this is the same pattern as the working Swagger curl examples.

---

#### `GET /products/photos/{photoId}` — Serve product photo

```http
GET /products/photos/69dcbedfe19e2b5563b17d8f
```

**Response:** Binary image stream with `Content-Type: image/jpeg` (or `image/png`).

> The frontend fetches this with `responseType: 'blob'` via Axios and creates a temporary `Blob URL` — images are never served with hardcoded `<img src>` paths.

---

### 🎓 Masteries (Services)

#### `GET /masterys/specials` — List masteries with filters

```http
GET /masterys/specials?title=plumbing&typeId=2
```

| Query Param | Type | Required | Description |
|-------------|------|----------|-------------|
| `title` | `String` | No | Partial title search |
| `typeId` | `Integer` | No | Filter by service type |

**Response `200 OK`:**
```json
[
  {
    "id": "mastery_1",
    "masterId": "m001",
    "title": "Professional Plumbing",
    "typeId": 2,
    "price": 500,
    "description": "Full plumbing installation and repair service",
    "photoId": "http://localhost:8888/masterys/photo/69e735f70e85962bbbe8cf9c"
  }
]
```

---

#### `POST /masterys` — Create mastery with photo *(🔒 StoreOwner)*

```http
POST /masterys
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

| Part | Type | Required | Description |
|------|------|----------|-------------|
| `mastery` | `String` (JSON) | ✅ | Mastery data as raw JSON string |
| `photo` | `File` (binary) | ❌ | Single cover photo |

**`mastery` JSON payload:**
```json
{
  "masterId": "m001",
  "title": "Professional Plumbing",
  "typeId": 2,
  "price": 500,
  "description": "Full plumbing installation and repair"
}
```

---

#### `GET /masterys/photo/{photoId}` — Serve mastery photo

```http
GET /masterys/photo/69e735f70e85962bbbe8cf9c
```

**Response:** Binary image stream.

---

### ⚠️ HTTP Response Codes

| Code | Status | When |
|------|--------|------|
| `200` | OK | Successful operation |
| `204` | No Content | Query returned empty result |
| `401` | Unauthorized | Missing, expired, or invalid JWT |
| `403` | Forbidden | Valid JWT but insufficient role |
| `500` | Internal Server Error | Unhandled exception — check server logs |

---

## 🔐 Security Model

### Authentication Flow

```
┌──────────┐         ┌─────────────┐        ┌──────────────┐
│  Browser │         │   Keycloak  │        │  Spring Boot │
│  React   │         │  Port 8080  │        │  Port 8888   │
└────┬─────┘         └──────┬──────┘        └──────┬───────┘
     │                      │                       │
     │  1. Login Request     │                       │
     │──────────────────────►│                       │
     │                      │                       │
     │  2. JWT Access Token  │                       │
     │◄──────────────────────│                       │
     │                      │                       │
     │  3. API Request + Bearer Token                │
     │───────────────────────────────────────────────►
     │                      │                       │
     │                      │  4. Validate JWT       │
     │                      │◄──────────────────────│
     │                      │  (JWKS endpoint)       │
     │                      │                       │
     │                      │  5. JWT Valid ✅        │
     │                      │──────────────────────►│
     │                      │                       │
     │  6. API Response (JSON)                       │
     │◄───────────────────────────────────────────────
```

### JWT Claims Structure

```json
{
  "sub": "729db74a-8811-4f57-b607-ab3e9af829a3",
  "iss": "http://localhost:8080/realms/myrealm",
  "azp": "frontend-mytools",
  "realm_access": {
    "roles": ["StoreOwner", "tools-basic", "offline_access"]
  },
  "resource_access": {
    "my-api": {
      "roles": ["tools-basic", "tools-guest", "tools-admin"]
    }
  },
  "preferred_username": "testuser",
  "email": "test@example.com"
}
```

### Role Permission Matrix

| Endpoint | `tools-guest` | `tools-basic` | `StoreOwner` | `tools-admin` |
|----------|:---:|:---:|:---:|:---:|
| `GET /products` | ✅ | ✅ | ✅ | ✅ |
| `GET /products/{id}` | ✅ | ✅ | ✅ | ✅ |
| `GET /products/photos/{id}` | ✅ | ✅ | ✅ | ✅ |
| `POST /products` | ❌ | ❌ | ✅ | ✅ |
| `GET /masterys/specials` | ✅ | ✅ | ✅ | ✅ |
| `POST /masterys` | ❌ | ❌ | ✅ | ✅ |
| Admin operations | ❌ | ❌ | ❌ | ✅ |

### Backend JWT Extraction

```java
// Every protected controller receives the validated JWT principal
@PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
             produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> AddMastery(
        @RequestPart("mastery") String masteryJson,
        @RequestPart(value = "photo", required = false) MultipartFile photo,
        @AuthenticationPrincipal Jwt jwt) {

    // Extract and validate user identity from JWT claim
    String sub = jwt.getClaim("sub");
    if (sub == null || sub.isEmpty()) {
        return ResponseEntity.status(401).body("Utilisateur non authentifié");
    }

    // Deserialize JSON string part manually (required for multipart)
    ObjectMapper mapper = new ObjectMapper();
    Mastery mastery = mapper.readValue(masteryJson, Mastery.class);

    // ... proceed with authenticated operation
}
```

> **Why `String` + `ObjectMapper`?** In `multipart/form-data` requests, Spring cannot auto-deserialize a JSON text part into a complex object via `@RequestPart`. Using `String` + manual `ObjectMapper.readValue()` is the only reliable pattern — the same approach used in both `/products` and `/masterys` controllers.

---

## 🤖 AI Integration

My-Tools leverages **Groq's ultra-fast inference** with the **LLaMA 3.3 70B Versatile** model:

### Configuration

```
Provider : Groq
Base URL : https://api.groq.com/openai
Model    : llama-3.3-70b-versatile
Protocol : OpenAI-compatible REST API
```

### Environment Setup

```env
# Development (.env.local) — never commit
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# Production — set as server environment variable only
# NEVER embed API keys in Vite client bundles
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

### Current Capabilities

| Feature | Description |
|---------|-------------|
| **Product Recommendations** | Suggests relevant tools based on category and context |
| **In-App Assistant** | Answers questions about tools, specs, rental terms |
| **Smart Search** | Natural language queries translated to filter parameters |
| **Description Generation** | AI-assisted product/mastery description writing |

> **⚠️ Production Security:** In development, `VITE_GROQ_API_KEY` is accessible in the browser bundle. For production, route all AI API calls through the Spring Boot backend to keep the key server-side only.

---

## 🗺️ Data Models

### Product Document

```javascript
{
  _id: ObjectId("69dcbedfe19e2b5563b17d95"),
  name: "Cordless Drill",        // String
  categoryId: NumberInt(8),      // Integer — category lookup
  markId: NumberInt(19),         // Integer — brand/mark lookup
  serieNum: NumberInt(8451),     // Integer — model/serie number
  description: "...",            // String
  price: NumberInt(150),         // Decimal — base price
  listedForId: NumberInt(0),       // Integer — 0=Sale, 1=Rent, 30=Both
  duration: NumberInt(12),       // Integer — rental duration in months
  photoIds: [                    // Array<String> — GridFS ObjectId refs
    "69dcbedfe19e2b5563b17d8f",
    "69dcbedfe19e2b5563b17d91"
  ],
  ownerId: null,                 // String — Keycloak sub (nullable)
  isavailable: true,             // Boolean
  _class: "com.example.BackEnd_MyTools.Entitys.Product"
}
```

### Mastery Document

```javascript
{
  _id: ObjectId("..."),
  masterId: "m001",              // String — business identifier
  title: "Professional Plumbing",// String
  typeId: NumberInt(2),          // Integer — service type
  price: NumberInt(500),         // Integer
  description: "...",            // String
  photoId: "69e735f70e85...",    // String — single GridFS ObjectId ref
  _class: "com.example.BackEnd_MyTools.Entitys.Mastery"
  // note: stored in collection "Service", not "Mastery"
}
```

---

🐳 Professional Docker Environment

My-Tools uses a multi-environment Docker architecture designed for real-world development and production deployment.

Instead of maintaining one oversized docker-compose.yml, the platform separates:

File	Purpose
docker-compose.yml	Shared base infrastructure
docker-compose.dev.yml	Development overrides
docker-compose.prod.yml	Production overrides
.env.dev	Development environment variables
.env.prod	Production secrets and configuration

This architecture provides:

✅ Environment isolation
✅ Safer production deployments
✅ Hot reload in development
✅ Production-optimized containers
✅ Internal-only networking
✅ Secure secret management
✅ Easier CI/CD integration
📁 Docker Architecture
My-Tools/
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .env.dev
├── .env.prod
├── .gitignore
│
├── BackEnd-MyTools/
│   ├── Dockerfile.dev
│   └── Dockerfile.prod
│
└── Frontend-MyTools/
    ├── Dockerfile.dev
    ├── Dockerfile.prod
    └── nginx.prod.conf
🧱 Base Compose File

The base compose file contains only shared infrastructure used by both development and production environments.

Included Services
Service	Purpose
MongoDB	Main application database
Kafka	Event streaming
Keycloak	Authentication and authorization
Networks	Internal service communication
Volumes	Persistent data storage
Why Ports Are Not Exposed in Base Config

Database and messaging services are intentionally kept internal.

This means:

MongoDB is not publicly reachable
Kafka is not publicly reachable
Zookeeper is not publicly reachable

Only application services communicate internally through Docker networking.

This is critical for production security.

🧪 Development Environment

The development override (docker-compose.dev.yml) enables developer-focused tooling and hot reload capabilities.

Development Features
Feature	Description
Hot Reload	Backend + frontend reload instantly
MongoDB Port Exposure	Connect with MongoDB Compass
Kafka Port Exposure	Local Kafka testing
Kafka UI	Browser-based Kafka management
Remote Debugging	Attach IntelliJ/VSCode debugger
Keycloak Dev Mode	Faster startup without HTTPS
Development Container Behavior
Backend

The backend uses:

Spring Boot DevTools
volume mounting
Maven dependency caching

Source code changes immediately reflect inside the running container.

Frontend

The frontend runs the Vite development server with:

HMR (Hot Module Reload)
live React refresh
mounted source code

Changes appear instantly in the browser without rebuilding images.

Start Development Environment
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  --env-file .env.dev \
  up --build -d
Stop Development Environment
docker-compose \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  down
Development URLs
Service	URL
Frontend	http://localhost:3000
Backend API	http://localhost:8888
Swagger UI	http://localhost:8888/swagger-ui/index.html
Keycloak	http://localhost:8080
Kafka UI	http://localhost:8090
MongoDB	mongodb://localhost:27017
🚀 Production Environment

The production override (docker-compose.prod.yml) enables hardened, optimized deployment settings.

Production Features
Feature	Description
Multi-stage builds	Smaller and safer images
JVM optimization	Tuned heap and garbage collection
Internal networking	Databases not publicly exposed
Keycloak production mode	Secure authentication setup
PostgreSQL for Keycloak	Persistent enterprise-grade storage
nginx frontend	Optimized static asset serving
Environment secrets	Externalized sensitive configuration
Production Security Improvements
MongoDB Authentication

Production MongoDB requires authentication:

MONGO_USER=mytools_user
MONGO_PASSWORD=strong_password
Keycloak Production Mode

Unlike development mode:

HTTPS is expected
PostgreSQL replaces file storage
proxy mode is enabled
hostname validation is enforced
Internal Networking

Only frontend and API ports are exposed publicly.

Infrastructure services remain isolated inside the Docker network.

🔐 Environment Variables
Development Environment

.env.dev

KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

Safe to commit because it contains no production secrets.

Production Environment

.env.prod

KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=strong_password

MONGO_DB=mytoolsdb
MONGO_USER=mytools_user
MONGO_PASSWORD=strong_password

KC_DB_USER=keycloak_user
KC_DB_PASSWORD=strong_password

KEYCLOAK_HOSTNAME=auth.mytools.com
API_DOMAIN=api.mytools.com

⚠️ Never commit .env.prod to Git.

🚫 Git Ignore Rules
.env.prod
*.env.local

This prevents accidental secret exposure.

🛠️ Dockerfiles
Backend Development Dockerfile

Development backend containers support:

Spring Boot DevTools
remote debugging
live reload
FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src

CMD ["mvn", "spring-boot:run"]
Backend Production Dockerfile

Production containers use a multi-stage build:

FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8888

ENTRYPOINT ["java", "-jar", "app.jar"]

Benefits:

smaller image size
faster deployments
reduced attack surface
no Maven runtime dependency
Frontend Development Dockerfile

The frontend development container runs the Vite dev server:

FROM node:18-alpine

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
Frontend Production Dockerfile

Production frontend uses nginx to serve optimized static assets:

FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
⚡ Makefile Shortcuts

To simplify Docker commands, My-Tools includes a Makefile.

Available Commands
dev-up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file .env.dev up --build -d

dev-down:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

prod-up:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up --build -d

prod-down:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
Usage
make dev-up
make dev-down
make dev-logs

make prod-up
make prod-down
📊 Development vs Production
Concern	Development	Production
Hot Reload	✅ Enabled	❌ Disabled
MongoDB Port	Exposed	Internal Only
Kafka UI	Enabled	Disabled
Remote Debugging	Enabled	Disabled
Keycloak Mode	start-dev	start
HTTPS	Optional	Required
Frontend Server	Vite	nginx
Backend Runtime	Maven	Optimized JAR
Database Security	Minimal	Authentication Enabled
Secrets	Local only	Externalized
🔒 Production Recommendations

Before deploying publicly:

Enable HTTPS with nginx or reverse proxy
Use strong passwords for all services
Enable MongoDB authentication
Add Docker healthchecks
Configure log rotation
Use pinned image versions instead of latest
Run containers as non-root users
Use external object storage for large-scale media hosting
Add monitoring (Prometheus/Grafana)
Configure automated backups


## 🐳 Docker Deployment

### Full Stack with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:

  mongodb:
    image: mongo:6
    container_name: my-tools-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: mytoolsdb
    networks:
      - my-tools-network

  keycloak:
    image: quay.io/keycloak/keycloak:latest
    container_name: my-tools-keycloak
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev
    networks:
      - my-tools-network

  backend:
    build:
      context: ./BackEnd-MyTools
      dockerfile: Dockerfile
    container_name: my-tools-backend
    restart: unless-stopped
    ports:
      - "8888:8888"
    environment:
      SPRING_DATA_MONGODB_URI: mongodb://mongodb:27017/mytoolsdb
      SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI: http://keycloak:8080/realms/myrealm
    depends_on:
      - mongodb
      - keycloak
    networks:
      - my-tools-network

  frontend:
    build:
      context: ./Frontend-MyTools
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: http://backend:8888
        VITE_KEYCLOAK_URL: http://keycloak:8080
        VITE_KEYCLOAK_REALM: myrealm
        VITE_KEYCLOAK_CLIENT_ID: frontend-mytools
    container_name: my-tools-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - my-tools-network

networks:
  my-tools-network:
    driver: bridge

volumes:
  mongo_data:
```

```bash
docker-compose up --build -d   # start all services
docker-compose logs -f backend # tail backend logs
docker-compose down            # stop all services
docker-compose down -v         # stop + remove volumes
```

### Backend `Dockerfile`

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend `Dockerfile`

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Product CRUD with `multipart/form-data` — JSON string + multiple binary photos
- [x] Mastery/Service CRUD with `multipart/form-data` — JSON string + single photo
- [x] MongoDB GridFS binary photo storage with `ObjectId` referencing
- [x] Keycloak JWT authentication with claim extraction (`sub`)
- [x] Role-based access control — `StoreOwner`, `tools-admin`, `tools-basic`, `tools-guest`
- [x] MapStruct DTO mapping — `photoId(s)` → full HTTP URLs with `@Named` qualifier
- [x] Specification-based dynamic filtering (category, mark, availability, name)
- [x] Swagger/OpenAPI with multipart form upload rendering
- [x] Structured request/response logging (user, IP, method, path, status, duration)
- [x] React product gallery with animated transitions and thumbnails
- [x] Frontend blob URL fetching — `productService.getProductPhoto()` with memory cleanup
- [x] MongoDB seed script — 30 products across 8 professional categories
- [x] Groq LLaMA 3.3 70B AI integration

### 🎯 Presentation-Ready Stabilization (2026-07-10)
- [x] **Backend Core Services Hardened** — GlobalExceptionHandler and RequestLoggingFilter now use resilient object-provider access instead of hard dependencies, preventing startup failures when logging services are unavailable
- [x] **BookingService Logic Stabilized** — Robust repository data retrieval, consistent booking sorting, and fallback behavior when profile data is missing
- [x] **MasteryService Business Rules Aligned** — Update logic preserves existing photo URLs unless explicitly updated, enforcing single-mastery policy for craftsmen
- [x] **All Backend Tests Passing** — 26/26 tests with zero failures, confirming stable service behavior
- [x] **Frontend Quality Polished** — Production build verified, lint warnings reduced to non-blocking levels, unused imports cleaned up, React hook dependency warnings addressed
- [x] **Documentation Refreshed** — Updated stack versions, added comprehensive stabilization section, enhanced architecture diagrams and request lifecycle documentation

### 🔧 Short Term
- [ ] **Shopping Cart** — add/remove items, quantity management, persisted in MongoDB per user
- [ ] **Order Management** — place orders with lifecycle: `pending → confirmed → shipped → delivered`
- [ ] **Rental Booking System** — date-range picker, availability calendar, conflict detection, duration-based pricing
- [ ] **User Profile Page** — edit personal info, manage own listings, view order history and liked products
- [ ] **Reviews & Ratings** — 1–5 star ratings with comments, average score on cards, verified purchase badge
- [ ] **Product Edit/Delete** — StoreOwners can update or remove their own listings

### 🚀 Medium Term
- [ ] **Real-Time Notifications** — WebSocket (STOMP) alerts for order updates, new messages, listing activity
- [ ] **In-App Messaging** — buyer/seller chat with read receipts, photo sharing, conversation history
- [ ] **Geolocation Listings** — MongoDB `2dsphere` index, radius-based proximity filtering, interactive map view
- [ ] **Payment Gateway** — Stripe integration for secure checkout, refund management, rental deposits
- [ ] **AI Smart Search** — semantic search using LLaMA embeddings, natural language to filter params
- [ ] **AI Chatbot** — streaming assistant for product advice, rental guidance, troubleshooting
- [ ] **PDF Invoice Generation** — itext7-powered order receipts and rental agreements (dependency already in pom.xml)
- [ ] **Email Notifications** — order confirmations, rental reminders, account events via SMTP/SendGrid

### 🌐 Long Term
- [ ] **React Native Mobile App** — iOS & Android client consuming the same Spring Boot API
- [ ] **Analytics Dashboard** — sales reports, top products, traffic insights, revenue charts with ClosedXML export
- [ ] **Multi-Tenancy** — support multiple independent stores under one platform with isolated data
- [ ] **CI/CD Pipeline** — GitHub Actions → Docker build → push to registry → Kubernetes rolling deploy
- [ ] **Elasticsearch** — full-text search across products, masteries, and descriptions with relevance scoring
- [ ] **Recommendation Engine** — collaborative filtering + content-based suggestions
- [ ] **Admin Panel** — platform-wide management UI for content moderation, user management, analytics
- [ ] **Vendor Verification** — document upload and manual review workflow for StoreOwner onboarding

### 🔧 Short Term
- [ ] **Shopping Cart** — add/remove items, quantity management, persisted in MongoDB per user
- [ ] **Order Management** — place orders with lifecycle: `pending → confirmed → shipped → delivered`
- [ ] **Rental Booking System** — date-range picker, availability calendar, conflict detection, duration-based pricing
- [ ] **User Profile Page** — edit personal info, manage own listings, view order history and liked products
- [ ] **Reviews & Ratings** — 1–5 star ratings with comments, average score on cards, verified purchase badge
- [ ] **Product Edit/Delete** — StoreOwners can update or remove their own listings

### 🚀 Medium Term
- [ ] **Real-Time Notifications** — WebSocket (STOMP) alerts for order updates, new messages, listing activity
- [ ] **In-App Messaging** — buyer/seller chat with read receipts, photo sharing, conversation history
- [ ] **Geolocation Listings** — MongoDB `2dsphere` index, radius-based proximity filtering, interactive map view
- [ ] **Payment Gateway** — Stripe integration for secure checkout, refund management, rental deposits
- [ ] **AI Smart Search** — semantic search using LLaMA embeddings, natural language to filter params
- [ ] **AI Chatbot** — streaming assistant for product advice, rental guidance, troubleshooting
- [ ] **PDF Invoice Generation** — itext7-powered order receipts and rental agreements (dependency already in pom.xml)
- [ ] **Email Notifications** — order confirmations, rental reminders, account events via SMTP/SendGrid

### 🌐 Long Term
- [ ] **React Native Mobile App** — iOS & Android client consuming the same Spring Boot API
- [ ] **Analytics Dashboard** — sales reports, top products, traffic insights, revenue charts with ClosedXML export
- [ ] **Multi-Tenancy** — support multiple independent stores under one platform with isolated data
- [ ] **CI/CD Pipeline** — GitHub Actions → Docker build → push to registry → Kubernetes rolling deploy
- [ ] **Elasticsearch** — full-text search across products, masteries, and descriptions with relevance scoring
- [ ] **Recommendation Engine** — collaborative filtering + content-based suggestions
- [ ] **Admin Panel** — platform-wide management UI for content moderation, user management, analytics
- [ ] **Vendor Verification** — document upload and manual review workflow for StoreOwner onboarding

---

## 🙋 FAQ

**Q: Why use `@RequestPart String productJson` instead of `@RequestPart Product product`?**

In `multipart/form-data` requests, Spring cannot automatically deserialize a JSON text part into a complex object. Using `@RequestPart String` + manual `ObjectMapper.readValue()` is the only reliable pattern. A `@RequestBody` annotation won't work either since the request isn't pure JSON — it's multipart. This is the pattern used consistently in both `/products` and `/masterys` controllers.

**Q: Why does `MasteryMapper` need `@Named` but `ProductMapper` doesn't?**

`ProductMapper` maps `List<String>` photo IDs. Since only `photoIds` is a `List<String>`, MapStruct applies the helper method exclusively to it. `MasteryMapper` maps a single `String` photoId — but `id`, `masterId`, `title`, and `description` are also `String`, so without `@Named` + `qualifiedByName`, MapStruct applies the URL transformation to every `String` field, corrupting the entire DTO.

**Q: Why are photos fetched as blobs instead of using `<img src="url">`?**

Because the photo endpoints require a JWT Bearer token. A plain `<img src>` tag cannot send authorization headers. Axios (configured with the token interceptor) fetches the binary data with `responseType: 'blob'`, then `URL.createObjectURL()` creates a temporary local URL that the `<img>` tag can use. The blob URL is revoked on component unmount with `URL.revokeObjectURL()` to prevent memory leaks.

**Q: The Keycloak JWT validation fails with a certificate error. What do I do?**

This is common in corporate environments with custom CA chains. Set the `cafile` path in your environment and ensure the Keycloak JWKS endpoint (`/realms/myrealm/protocol/openid-connect/certs`) is reachable from the Spring Boot process. You can also configure `spring.security.oauth2.resourceserver.jwt.jwk-set-uri` explicitly to bypass DNS resolution issues.

---

## 🤝 Contributing

### Branching Strategy

```
main       ← production-ready, protected
develop    ← integration branch
feature/*  ← new features (branch from develop)
fix/*      ← bug fixes (branch from develop)
hotfix/*   ← urgent production fixes (branch from main)
```

### Workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/My-Tools.git
cd My-Tools

# 2. Create feature branch from develop
git checkout develop
git checkout -b feature/shopping-cart

# 3. Make changes and commit
git add .
git commit -m "feat: add shopping cart with MongoDB persistence"

# 4. Push and open PR against develop
git push origin feature/shopping-cart
```

### Commit Convention

```
feat:      new feature or capability
fix:       bug fix
docs:      documentation changes only
refactor:  code restructuring without behavior change
style:     formatting, whitespace, missing semicolons
test:      adding or updating tests
chore:     build system, dependencies, tooling
perf:      performance improvement
ci:        CI/CD configuration changes
```

### Code Standards

**Backend (Java)**
- Services, repositories, and controllers in separate packages — never mix concerns
- DTOs for all API responses — never expose `@Document` entity classes directly
- All protected endpoints must validate JWT `sub` claim before processing
- Use `ResponseEntity<?>` with explicit HTTP status codes
- Log at `INFO` for business operations, `DEBUG` for internals, `ERROR` for exceptions with stack traces

**Frontend (React)**
- Functional components only — hooks over class components
- All API calls go through the service layer — no raw `fetch` or `axios` in components
- Never store tokens in `localStorage` or `sessionStorage`
- Use `useNavigate` for programmatic routing — no `window.location` assignments
- Revoke blob URLs on component unmount to prevent memory leaks

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

<div align="center">

### Built with ❤️ by [badluck0321](https://github.com/badluck0321)

**[⬆ Back to Top](#-my-tools)**

<br/>

If this project helped you, consider giving it a ⭐ — it helps others discover it!

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-badluck0321-181717?style=for-the-badge&logo=github)](https://github.com/badluck0321)

</div>