// src/routes/routeConfig.js
import Home from "../pages/home/Home";
import About from "../pages/home/About";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductsIndex from "../pages/Products/ProductsIndex";
import ProductInfos from "../pages/Products/ProductInfos";
import StoreInfos from "../pages/Stores/StoreInfos";
import StoresIndex from "../pages/Stores/StoresIndex";
import MasteryInfos from "../pages/Masterys/MasteryInfos";
import MasteryHistory from "../pages/Masterys/MasteryHistory";
import MasterysIndex from "../pages/Masterys/MasterysIndex";
import CartPage from "../pages/cart/CartPage";
import ForumPage from "../pages/Forum/ForumPage";
import Contact from "../components/layout/Contact";
import Careers from "../components/layout/Careers";
import Blog from "../components/layout/Blog";
import Privacy from "../components/layout/Privacy";
import Terms from "../components/layout/Terms";
import RefundPolicy from "../components/layout/Refundpolicy";
import DemandesPage from "../pages/Demandes/DemandesPage";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/Products", element: <ProductsIndex /> },
  { path: "/products/:id", element: <ProductInfos /> },
  { path: "/stores", element: <StoresIndex /> },
  { path: "/stores/owner/:ownerId", element: <StoreInfos /> },
  { path: "/Masterys", element: <MasterysIndex /> },
  { path: "/Masterys/history/:masterId", element: <MasteryHistory /> },
  { path: "/Masterys/:id", element: <MasteryInfos /> },
  { path: "/forum", element: <ForumPage /> },
  { path: "/demandes", element: <DemandesPage /> },
  { path: "/contact", element: <Contact /> },
  { path: "/careers", element: <Careers /> },
  { path: "/blog", element: <Blog /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },
  { path: "/refund", element: <RefundPolicy /> },
];
export const protectedRoutes = [
  { path: "/dashboard/*", element: <Dashboard /> },
  { path: "/cart", element: <CartPage /> },
];
