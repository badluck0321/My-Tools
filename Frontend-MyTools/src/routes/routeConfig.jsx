// src/routes/routeConfig.js
import Home from "../pages/home/Home";
import About from "../pages/home/About";
import EventFormPage from "../pages/events/EventFormPage";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductsIndex from "../pages/Products/ProductsIndex";
import ProductInfos from "../pages/Products/ProductInfos";
import MasteryInfos from "../pages/Masterys/MasteryInfos";
import MasterysIndex from "../pages/Masterys/MasterysIndex";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/Products", element: <ProductsIndex /> },
  { path:"/products/:id", element:<ProductInfos />},
  { path: "/Masterys", element: <MasterysIndex /> },
  { path: "/Masterys/:id", element: <MasteryInfos /> },
];

export const protectedRoutes = [
  { path: "/dashboard/*", element: <Dashboard /> },
  { path: "/events/create", element: <EventFormPage /> },
  { path: "/events/edit/:slug", element: <EventFormPage /> },
];
