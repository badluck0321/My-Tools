import { USER_ROLES } from '../utils/constants';

const ROLE_ALIASES = {
  admin: [USER_ROLES.ADMIN, 'mt-admin', 'admin', 'ADMIN'],
  'store-owner': [USER_ROLES.STORE_OWNER, 'mt-storeowner', 'storeowner', 'store-owner', 'store_owner', 'tools-store-owner', 'tools-storeowner'],
  'craft-man': ['mt-CraftMan', 'mt-Craftsman', 'craftman', 'craft-man', 'craftsman', 'tools-craft-man', 'tools-craftman', 'tools-craftsman'],
  guest: [USER_ROLES.GUEST, 'guest', 'tools-guest', 'anonymous'],
};

const normalizeRoleValue = (value) => {
  if (!value) return '';
  const normalized = String(value).trim().toLowerCase();
  if (ROLE_ALIASES.admin.includes(String(value))) return 'admin';
  if (ROLE_ALIASES['store-owner'].includes(String(value))) return 'store-owner';
  if (ROLE_ALIASES['craft-man'].includes(String(value))) return 'craft-man';
  if (ROLE_ALIASES.guest.includes(String(value))) return 'guest';
  if (normalized === 'tools-basic') return 'tools-basic';
  return normalized;
};

export const resolveUserRole = (user = {}, roles = []) => {
  const candidates = [
    ...(Array.isArray(roles) ? roles : []),
    user?.role,
    user?.roles,
    user?.userRole,
  ].flat().filter(Boolean);

  for (const candidate of candidates) {
    const resolved = normalizeRoleValue(candidate);
    if (resolved) return resolved;
  }

  return 'user';
};

export const isAdminRole = (user = {}, roles = []) => resolveUserRole(user, roles) === 'admin';
export const isStoreOwnerRole = (user = {}, roles = []) => resolveUserRole(user, roles) === 'store-owner';
export const isCraftManRole = (user = {}, roles = []) => resolveUserRole(user, roles) === 'craft-man';
