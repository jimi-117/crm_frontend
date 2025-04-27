// src/lib/api/config.ts
import { browser } from '$app/environment';

// APIのベースURL（環境変数またはデフォルト値）
export const API_BASE_URL = browser ? import.meta.env.VITE_API_URL || 'http://localhost:8000' : '';