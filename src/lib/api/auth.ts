// src/lib/api/auth.ts
import { browser } from '$app/environment';
import { authStore } from '../stores/authStore';
import { API_BASE_URL } from './config';

/**
 * 認証関連のAPIインターフェース
 */
export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  role: string;
  city: string;
}


export async function login(loginData: LoginData): Promise<UserProfile> {
    const url = `${API_BASE_URL}/token`;
    console.log("API request to:", url);
    
    const formData = new FormData();
    formData.append('username', loginData.email);
    formData.append('password', loginData.password);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
    
    if (!response.ok) {
      let errorMsg = 'Échec de la connexion';
      try {
        const errorData = await response.json();
        errorMsg = errorData.detail || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }
    
    // トークンレスポンスの処理
    const authData: AuthResponse = await response.json();
    
    // ユーザープロファイル取得
    const profileResponse = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${authData.access_token}`
      }
    });
    
    if (!profileResponse.ok) {
      throw new Error('Échec de la récupération du profil');
    }
    
    const userProfile: UserProfile = await profileResponse.json();
    
    // 認証情報をストアに保存
    authStore.set({
      email: loginData.email,
      token: authData.access_token,
      ...userProfile
    });
    
    // ローカルストレージにも保存（ブラウザの場合のみ）
    if (browser) {
      localStorage.setItem('user', JSON.stringify({
        email: loginData.email,
        token: authData.access_token,
        ...userProfile
      }));
    }
    
    return userProfile;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * ログアウト処理
 */
export function logout(): void {
  authStore.set(null);
  if (browser) {
    localStorage.removeItem('user');
  }
}