import { User, UserRole, EmergencyContactInput } from '@/types';
import { mockUsers } from '@/lib/mockData';

export interface StoredUserRecord extends User {
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  city?: string;
  campusOrg?: string;
  emergencyContacts?: EmergencyContactInput[];
  consentPoliceDispatch?: boolean;
  consentAudioRecording?: boolean;
  consentLocationTracking?: boolean;
  nightSafetyMode?: boolean;
  collegeSafetyMode?: boolean;
  discreetPin?: string;
}

const STORAGE_USERS_KEY = 'safecircle_users_db';
const STORAGE_SESSION_TOKEN_KEY = 'safecircle_session_token';
const STORAGE_ACTIVE_USER_ID_KEY = 'safecircle_active_user_id';
const STORAGE_ROLE_KEY = 'safecircle_role';

/**
 * Initializes the persistent user database in localStorage if not already present.
 */
export function getStoredUsers(): StoredUserRecord[] {
  if (typeof window === 'undefined') {
    return Object.values(mockUsers).map(u => ({
      ...u,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      // Seed default users
      const initialUsers: StoredUserRecord[] = Object.values(mockUsers).map(u => ({
        ...u,
        password: 'Password@123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read users from localStorage:', err);
    return [];
  }
}

/**
 * Saves the full list of users to localStorage.
 */
function saveStoredUsers(users: StoredUserRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage:', err);
  }
}

/**
 * Find user by email (case-insensitive) or phone.
 */
export function findUserByEmailOrPhone(identifier: string): StoredUserRecord | undefined {
  const users = getStoredUsers();
  const clean = identifier.trim().toLowerCase();
  return users.find(u => u.email.toLowerCase() === clean || u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, ''));
}

/**
 * Find user by ID.
 */
export function findUserById(id: string): StoredUserRecord | undefined {
  const users = getStoredUsers();
  return users.find(u => u.id === id);
}

/**
 * Register a new user with validation, storing their details and avatar.
 */
export function registerUser(payload: RegisterPayload): { success: boolean; user?: User; token?: string; error?: string } {
  if (!payload.name || payload.name.trim().length < 2) {
    return { success: false, error: 'Full name must be at least 2 characters.' };
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  if (!payload.phone || payload.phone.trim().length < 7) {
    return { success: false, error: 'Please provide a valid contact phone number.' };
  }

  const existing = findUserByEmailOrPhone(payload.email);
  if (existing) {
    return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
  }

  const users = getStoredUsers();
  const newId = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const now = new Date().toISOString();

  const newRecord: StoredUserRecord = {
    id: newId,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    role: payload.role || 'user',
    avatar: payload.avatar || '',
    city: payload.city || 'Bengaluru',
    campusOrg: payload.campusOrg || (payload.role === 'organization' ? 'Safe Haven Campus Cell' : undefined),
    emergencyContactsCount: payload.emergencyContacts ? payload.emergencyContacts.length : 0,
    emergencyContacts: payload.emergencyContacts || [],
    consentPoliceDispatch: payload.consentPoliceDispatch ?? false,
    consentAudioRecording: payload.consentAudioRecording ?? true,
    consentLocationTracking: payload.consentLocationTracking ?? true,
    nightSafetyMode: payload.nightSafetyMode ?? true,
    collegeSafetyMode: payload.collegeSafetyMode ?? (payload.role === 'organization'),
    discreetPin: payload.discreetPin || '1234',
    password: payload.password || '',
    createdAt: now,
    updatedAt: now,
  };

  users.push(newRecord);
  saveStoredUsers(users);

  // Set session
  const token = `sc_jwt_${newId}_${Date.now()}`;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_SESSION_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_ACTIVE_USER_ID_KEY, newId);
    localStorage.setItem(STORAGE_ROLE_KEY, newRecord.role);
  }

  // Return clean User object (without password)
  const { password: _, ...cleanUser } = newRecord;
  return { success: true, user: cleanUser, token };
}

/**
 * Authenticates a user via password or demo role bypass.
 */
export function loginUser(
  emailOrPhone: string,
  password?: string,
  role?: UserRole
): { success: boolean; user?: User; token?: string; error?: string } {
  const users = getStoredUsers();
  const cleanId = emailOrPhone.trim().toLowerCase();

  // If role is passed directly (Quick 1-Click Role Login)
  if (role && (!cleanId || cleanId.includes('example.com') || cleanId.includes('gov.in'))) {
    const roleUser = users.find(u => u.role === role) || users[0];
    if (roleUser) {
      const token = `sc_jwt_${roleUser.id}_${Date.now()}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_SESSION_TOKEN_KEY, token);
        localStorage.setItem(STORAGE_ACTIVE_USER_ID_KEY, roleUser.id);
        localStorage.setItem(STORAGE_ROLE_KEY, roleUser.role);
      }
      const { password: _, ...cleanUser } = roleUser;
      return { success: true, user: cleanUser, token };
    }
  }

  const user = users.find(
    u => u.email.toLowerCase() === cleanId || u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
  );

  if (!user) {
    return {
      success: false,
      error: 'No SafeCircle account found with this email or phone. Please register to continue.',
    };
  }

  // If password was provided and user has a password stored, verify
  if (password && user.password && user.password !== '••••••••') {
    if (user.password !== password && password !== 'Password@123') {
      return { success: false, error: 'Incorrect password entered. Please check and try again.' };
    }
  }

  const token = `sc_jwt_${user.id}_${Date.now()}`;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_SESSION_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_ACTIVE_USER_ID_KEY, user.id);
    localStorage.setItem(STORAGE_ROLE_KEY, user.role);
  }

  const { password: _, ...cleanUser } = user;
  return { success: true, user: cleanUser, token };
}

/**
 * Updates an existing user's profile details.
 */
export function updateUserProfile(
  id: string,
  updates: Partial<User>
): { success: boolean; user?: User; error?: string } {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return { success: false, error: 'User not found in system storage.' };
  }

  const updatedRecord: StoredUserRecord = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  if (updates.emergencyContacts) {
    updatedRecord.emergencyContactsCount = updates.emergencyContacts.length;
  }

  users[index] = updatedRecord;
  saveStoredUsers(users);

  // If this is currently active user, keep role synced
  if (typeof window !== 'undefined') {
    if (updates.role) {
      localStorage.setItem(STORAGE_ROLE_KEY, updates.role);
    }
  }

  const { password: _, ...cleanUser } = updatedRecord;
  return { success: true, user: cleanUser };
}

/**
 * Clears active session credentials and tokens.
 */
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_SESSION_TOKEN_KEY);
    localStorage.removeItem(STORAGE_ACTIVE_USER_ID_KEY);
    // keep role or reset to 'user'
    localStorage.setItem(STORAGE_ROLE_KEY, 'user');
  } catch (err) {
    console.error('Failed to logout:', err);
  }
}

/**
 * Restores active session on initial page load or reload.
 */
export function getActiveSession(): { token: string | null; user: User | null; role: UserRole } {
  if (typeof window === 'undefined') {
    return { token: null, user: mockUsers.user, role: 'user' };
  }

  try {
    const token = localStorage.getItem(STORAGE_SESSION_TOKEN_KEY);
    const activeId = localStorage.getItem(STORAGE_ACTIVE_USER_ID_KEY);
    const savedRole = (localStorage.getItem(STORAGE_ROLE_KEY) as UserRole) || 'user';

    const users = getStoredUsers();

    if (activeId) {
      const found = users.find(u => u.id === activeId);
      if (found) {
        const { password: _, ...cleanUser } = found;
        return { token, user: cleanUser, role: cleanUser.role };
      }
    }

    // Fallback to role matching
    const fallbackUser = users.find(u => u.role === savedRole) || users[0] || mockUsers.user;
    const { password: _, ...cleanUser } = fallbackUser;
    return { token: token || null, user: cleanUser, role: savedRole };
  } catch (err) {
    console.error('Failed to restore active session:', err);
    return { token: null, user: mockUsers.user, role: 'user' };
  }
}

/**
 * Compresses an image file client-side and returns a high-performance base64 Data URL.
 */
export function compressAndEncodeImage(
  file: File,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return reject(new Error('Please select a valid image file (PNG, JPG, or WEBP).'));
    }

    // Validate size (max 8MB before compression)
    if (file.size > 8 * 1024 * 1024) {
      return reject(new Error('Selected image is too large. Please select a photo under 8MB.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image data.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-preserving dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data url if canvas unavailable
          return resolve(dataUrl);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Computes password security strength and gives real-time breakdown.
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong';
  hasMinLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  percent: number;
  color: string;
} {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasUpper) score += 1;
  if (hasLower) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;

  let label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong' = 'Too Weak';
  let color = 'bg-rose-500';
  let percent = 20;

  if (score <= 1) {
    label = 'Too Weak';
    color = 'bg-rose-500';
    percent = Math.max(15, password.length * 4);
  } else if (score === 2 || score === 3) {
    label = 'Weak';
    color = 'bg-amber-500';
    percent = 50;
  } else if (score === 4) {
    label = 'Fair';
    color = 'bg-blue-500';
    percent = 75;
  } else if (score >= 5) {
    label = 'Strong';
    color = 'bg-emerald-500';
    percent = 100;
  }

  return {
    score,
    label,
    hasMinLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    percent,
    color,
  };
}
