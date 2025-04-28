// src/lib/config.ts
// フロントエンド用の設定ファイル
import { browser } from '$app/environment';

// APIのベースURL
export const API_BASE_URL = browser ? 
  import.meta.env.VITE_API_URL || 'http://localhost:8000' : '';

// 認証関連の設定
export const AUTH_CONFIG = {
  // ローカルストレージ内の認証情報のキー
  STORAGE_KEY: 'user',
  
  // JWTトークンの有効期限（分）
  TOKEN_EXPIRY_MINUTES: 60 * 24, // 24時間
  
  // リダイレクト設定
  LOGIN_REDIRECT: '/',
  LOGOUT_REDIRECT: '/login'
};

// 都市設定
export const AVAILABLE_CITIES = ['paris', 'lyon', 'rennes'];

// 開発モード判定
export const isDevelopment = process.env.NODE_ENV === 'development';