import { db } from '../db';
import type { User } from '../types';

export const SESSION_KEY = 'harvesthub_current_user_id';

export const DEFAULT_DEMO_USER: Omit<User, 'id'> = {
  fullName: 'Rajesh Kumar',
  email: 'farmer@example.com',
  password: 'password123',
  farmName: 'Green Valley Farm',
  createdAt: '2026-01-01T08:00:00.000Z'
};

export interface IAuthService {
  initAuth(): Promise<User | null>;
  getCurrentUser(): Promise<User | null>;
  getCurrentUserId(): number | null;
  login(email: string, password: string): Promise<User>;
  register(userData: {
    fullName: string;
    email: string;
    password: string;
    farmName: string;
  }): Promise<User>;
  logout(): Promise<void>;
  ensureDefaultUser(): Promise<User>;
}

export class IndexedDBAuthService implements IAuthService {
  async initAuth(): Promise<User | null> {
    await this.ensureDefaultUser();
    return await this.getCurrentUser();
  }

  getCurrentUserId(): number | null {
    if (typeof window === 'undefined') return null;
    const storedId = localStorage.getItem(SESSION_KEY);
    if (!storedId) return null;
    const parsed = parseInt(storedId, 10);
    return isNaN(parsed) ? null : parsed;
  }

  async getCurrentUser(): Promise<User | null> {
    const id = this.getCurrentUserId();
    if (!id) return null;
    try {
      const user = await db.users.get(id);
      if (!user) {
        // Stale session
        this.clearSession();
        return null;
      }
      return user;
    } catch (err) {
      console.error('Failed to get current user:', err);
      return null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    
    // First ensure default demo user is seeded if table is empty
    await this.ensureDefaultUser();

    // Query user by email (case-insensitive)
    const user = await db.users
      .filter((u) => u.email.trim().toLowerCase() === normalizedEmail)
      .first();

    if (!user || user.password !== password) {
      // Must not expose whether the email or password was specifically incorrect
      throw new Error('Invalid email or password.');
    }

    // Set local session
    if (typeof window !== 'undefined' && user.id) {
      localStorage.setItem(SESSION_KEY, String(user.id));
    }

    const session = {
      userId: user.id || 1,
      fullName: user.fullName,
      email: user.email,
      farmName: user.farmName,
      token: `session_${user.id}_${Date.now()}`
    };

    return {
      ...user,
      success: true,
      session,
      message: 'Logged in successfully.'
    };
  }

  async register(userData: {
    fullName: string;
    email: string;
    password: string;
    farmName: string;
  }): Promise<User> {
    const fullName = userData.fullName.trim();
    const email = userData.email.trim().toLowerCase();
    const password = userData.password;
    const farmName = userData.farmName.trim();

    // Validation
    if (!fullName || !email || !password || !farmName) {
      throw new Error('All required fields must be filled.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address.');
    }

    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters.');
    }

    // Check if user already exists
    const existing = await db.users
      .filter((u) => u.email.trim().toLowerCase() === email)
      .first();

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: Omit<User, 'id'> = {
      fullName,
      email,
      password,
      farmName,
      createdAt: new Date().toISOString()
    };

    const id = await db.users.add(newUser as User);
    const created = await db.users.get(id);
    if (!created) {
      throw new Error('Failed to create account. Please try again.');
    }

    const session = {
      userId: Number(id),
      fullName: created.fullName,
      email: created.email,
      farmName: created.farmName,
      token: `session_${id}_${Date.now()}`
    };

    return {
      ...created,
      success: true,
      session,
      message: 'Account created successfully.'
    };
  }

  async logout(): Promise<void> {
    this.clearSession();
  }

  clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  async ensureDefaultUser(): Promise<User> {
    try {
      const count = await db.users.count();
      if (count === 0) {
        const id = await db.users.add(DEFAULT_DEMO_USER as User);
        const user = await db.users.get(id);
        return user!;
      }
      const first = await db.users.toCollection().first();
      return first!;
    } catch (err) {
      console.warn('Error checking/ensuring default user in IndexedDB:', err);
      // Fallback
      return {
        id: 1,
        ...DEFAULT_DEMO_USER
      };
    }
  }
}

export const authService: IAuthService = new IndexedDBAuthService();
