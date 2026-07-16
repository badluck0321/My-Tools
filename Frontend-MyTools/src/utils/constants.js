import i18n from "../i18n";

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
  { id: "all", label: i18n.t("priceRanges.all"), min: 0, max: Infinity },
  { id: "under-500", label: i18n.t("priceRanges.under500"), min: 0, max: 500 },
  { id: "500-1000", label: i18n.t("priceRanges.500to1000"), min: 500, max: 1000 },
  { id: "1000-5000", label: i18n.t("priceRanges.1000to5000"), min: 1000, max: 5000 },
  { id: "above-5000", label: i18n.t("priceRanges.above5000"), min: 5000, max: Infinity },
];

export const SORT_OPTIONS = [
  { id: "newest", label: i18n.t("sortOptions.newest") },
  { id: "oldest", label: i18n.t("sortOptions.oldest") },
  { id: "price-low", label: i18n.t("sortOptions.priceLow") },
  { id: "price-high", label: i18n.t("sortOptions.priceHigh") },
  { id: "popular", label: i18n.t("sortOptions.popular") },
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
