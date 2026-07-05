// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888';

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id) => `/products/${id}`,
  PRODUCT_PHOTO: (id) => `/products/photos/${id}`,
  MASTERYS: '/masterys',
  MASTERY_DETAIL: (id) => `/masterys/${id}`,
  MASTERY_PHOTO: (id) => `/masterys/photos/${id}`,
  STORES: '/stores',
  STORE_DETAIL: (id) => `/stores/${id}`,
  STORE_MINE: '/stores/mine',
  CART: '/cart',
  CART_ADD: (productId) => `/cart/items/${productId}`,
  ORDERS: '/orders/my',
  ORDER_CHECKOUT: '/orders/checkout',
  PAYMENTS_CHECKOUT: (orderId) => `/payments/checkout/${orderId}`,
  BOOKINGS: '/bookings/my',
  FAVORITES: '/favorites',
  FORUM_QUESTIONS: '/forum/questions',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  LOOKUPS: '/api/Lookups',
  DEMANDES: '/demandes',
};

export const USER_ROLES = {
  STORE_OWNER: 'mt-StoreOwner',
  ADMIN: 'mt-Admin',
  BASIC: 'tools-basic',
  GUEST: 'tools-guest',
};
export const PRICE_RANGES = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-500', label: 'Under 500 MAD', min: 0, max: 500 },
  { id: '500-1000', label: '500-1,000 MAD', min: 500, max: 1000 },
  { id: '1000-5000', label: '1,000-5,000 MAD', min: 1000, max: 5000 },
  { id: 'above-5000', label: 'Above 5,000 MAD', min: 5000, max: Infinity },
];

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'popular', label: 'Most Popular' },
];

export const STORAGE_KEYS = {
  TOKEN: 'mytools_token',
  REFRESH_TOKEN: 'mytools_refresh_token',
  USER: 'mytools_user',
  THEME: 'mytools_theme',
};

export const FADE_IN_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const SLIDE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const SCALE_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
