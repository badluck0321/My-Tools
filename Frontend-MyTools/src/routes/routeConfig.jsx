// src/routes/routeConfig.js
import Home from "../pages/home/Home";
import About from "../pages/home/About";
import Gallery from "../pages/gallery/Gallery";
import EventsPage from "../pages/events/EventsPage";
import EventDetailPage from "../pages/events/EventDetailPage";
import EventFormPage from "../pages/events/EventFormPage";
import Dashboard from "../pages/dashboard/Dashboard";

export const publicRoutes = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/events", element: <EventsPage /> },
  { path: "/events/:slug", element: <EventDetailPage /> },
];

export const protectedRoutes = [
  { path: "/dashboard/*", element: <Dashboard /> },
  { path: "/events/create", element: <EventFormPage /> },
  { path: "/events/edit/:slug", element: <EventFormPage /> },
];
