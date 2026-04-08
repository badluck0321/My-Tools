// src/routes/routeConfig.js
import Home from "../pages/home/Home";
import About from "../pages/home/About";
// import Gallery from "../pages/gallery/Gallery";
import EventsPage from "../pages/events/EventsPage";
import EventDetailPage from "../pages/events/EventDetailPage";
import EventFormPage from "../pages/events/EventFormPage";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductsIndex from "../pages/Products/ProductsIndex";
import ProductInfos from "../pages/Products/ProductInfos";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/Products", element: <ProductsIndex /> },
  { path:"/products/:id", element:<ProductInfos />},

  { path: "/events", element: <EventsPage /> },
  { path: "/events/:slug", element: <EventDetailPage /> },
];

export const protectedRoutes = [
  { path: "/dashboard/*", element: <Dashboard /> },
  { path: "/events/create", element: <EventFormPage /> },
  { path: "/events/edit/:slug", element: <EventFormPage /> },
];
