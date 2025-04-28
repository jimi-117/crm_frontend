// src/lib/api/config.ts
import { browser } from '$app/environment';

// APIのベースURL（環境変数またはデフォルト値）
export const API_BASE_URL = browser ? 
  import.meta.env.VITE_API_URL || 'http://localhost:8000' : '';

// APIリクエスト設定
export const API_CONFIG = {
  // リクエストタイムアウト（ミリ秒）
  TIMEOUT: 15000,
  
  // リトライ回数
  RETRY_COUNT: 3,
  
  // ヘッダー設定
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// APIエンドポイント
export const API_ENDPOINTS = {
  // 認証関連
  AUTH: {
    TOKEN: '/token',
    USER_PROFILE: '/users/me/'
  },
  
  // クライアント関連
  CLIENTS: {
    BASE: '/clients/',
    DETAIL: (id: number) => `/clients/${id}`
  },
  
  // プロスペクト関連
  PROSPECTS: {
    BASE: '/prospects/',
    DETAIL: (id: number) => `/prospects/${id}`,
    RECOMMENDED: '/prospects/recommended/'
  },
  
  // 統計関連
  STATISTICS: {
    DASHBOARD: '/statistics/dashboard/',
    REVENUE: '/statistics/revenue/',
    CLIENT_STATUS: '/statistics/client-status/',
    PROSPECT_STATUS: '/statistics/prospect-status/'
  },
  
  // コンテンツ関連
  CONTENT: {
    BASE: '/content-items/',
    DETAIL: (id: number) => `/content-items/${id}`
  }
};