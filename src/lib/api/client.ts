// src/lib/api/client.ts
import { authStore } from '../stores/authStore';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

// APIのベースURL（環境変数またはデフォルト値）
const API_BASE_URL = browser ? import.meta.env.VITE_API_URL || 'http://localhost:8000' : '';

/**
 * 認証トークンを含めたFetchリクエストを行う関数
 */
export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const auth = get(authStore);
  
  // ヘッダーの設定（認証トークンを含める）
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // 認証トークンがある場合はAuthorizationヘッダーに追加
  if (auth?.token) {
    headers['Authorization'] = `Bearer ${auth.token}`;
  }
  
  // リクエストの実行
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // 401エラー（認証切れ）の場合はログアウト処理
  if (response.status === 401) {
    // 認証情報をクリア
    authStore.set(null);
    if (browser) {
      localStorage.removeItem('user');
      // ログインページにリダイレクト
      goto('/login');
    }
  }
  
  return response;
}

/**
 * API呼び出しユーティリティ関数
 */
export const api = {
  // GETリクエスト
  async get<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    // URLサーチパラメータの構築
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    const response = await fetchWithAuth(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  // POSTリクエスト
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  // PUTリクエスト
  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json() as Promise<T>;
  },
  
  // DELETEリクエスト
  async delete(endpoint: string): Promise<void> {
    const response = await fetchWithAuth(endpoint, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
  }
};