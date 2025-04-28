// src/lib/stores/authStore.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { AUTH_CONFIG } from '$lib/config';

// 認証済みユーザーのインターフェイス
export interface AuthUser {
  id?: number;
  email: string;
  token: string;
  role?: string;
  city?: string;
}

// 初期状態の設定
let initialValue: AuthUser | null = null;

// ブラウザ環境の場合、ローカルストレージから認証情報を復元
if (browser) {
  const storedAuth = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
  if (storedAuth) {
    try {
      initialValue = JSON.parse(storedAuth);
    } catch (e) {
      console.error('Failed to parse auth from localStorage:', e);
    }
  }
}

// 認証ストアの作成
export const authStore = writable<AuthUser | null>(initialValue);

// ログイン状態をチェックする関数
export function isLoggedIn(): boolean {
  if (!browser) return false;
  
  const storedAuth = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
  return !!storedAuth;
}