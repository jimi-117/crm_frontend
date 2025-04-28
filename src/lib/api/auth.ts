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
    const formData = new FormData();
    formData.append('username', loginData.email);
    formData.append('password', loginData.password);
    
    const apiUrl = `${API_BASE_URL}/token`;
    console.log('Login attempt for:', loginData.email);
    console.log('API endpoint:', apiUrl);
    console.log('API base URL:', API_BASE_URL);
    
    try {
      // トークン取得リクエスト
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        let errorMsg = 'Échec de la connexion';
        try {
          const errorData = await response.json();
          console.log('Login error data:', errorData);
          errorMsg = errorData.detail || errorMsg;
        } catch (error) {
          console.log('Could not parse error response:', error);
          
          // レスポンスのテキストを試してみる
          try {
            const errorText = await response.text();
            console.log('Error response text:', errorText);
          } catch (e) {
            console.log('Could not get response text either');
          }
        }
        throw new Error(errorMsg);
      }
    
      // トークンレスポンスの処理
      const authData: AuthResponse = await response.json();
      console.log('Login successful, got token');
      
      // ユーザープロファイル取得
      const profileUrl = `${API_BASE_URL}/users/me`;
      console.log('Fetching user profile from:', profileUrl);
      const profileResponse = await fetch(profileUrl, {
        headers: {
          'Authorization': `Bearer ${authData.access_token}`
        }
      });
      
      console.log('Profile response status:', profileResponse.status);
      
      if (!profileResponse.ok) {
        throw new Error('Échec de la récupération du profil');
      }
      
      const userProfile: UserProfile = await profileResponse.json();
      console.log('Got user profile:', userProfile);
      
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