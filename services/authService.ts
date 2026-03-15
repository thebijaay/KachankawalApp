import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'kmrm_auth_user';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  ward: string;
  isLoggedIn: boolean;
}

export const authService = {
  async getUser(): Promise<AuthUser | null> {
    try {
      const data = await AsyncStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async saveUser(user: AuthUser): Promise<void> {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  },

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    // Simulated OTP send
    await new Promise(r => setTimeout(r, 1200));
    return { success: true, message: 'OTP sent to ' + phone };
  },

  async verifyOTP(
    phone: string,
    otp: string,
    name: string,
    ward: string
  ): Promise<{ success: boolean; user?: AuthUser; message: string }> {
    await new Promise(r => setTimeout(r, 1000));
    // Accept any 6-digit OTP for mock
    if (otp.length === 6) {
      const user: AuthUser = {
        id: 'USR-' + Date.now(),
        name,
        phone,
        ward,
        isLoggedIn: true,
      };
      await authService.saveUser(user);
      return { success: true, user, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid OTP. Please try again.' };
  },
};
