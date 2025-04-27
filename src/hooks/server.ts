// src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';

// 保護されたルートのリスト
const protectedRoutes = ['/', '/clients', '/prospects', '/statistics'];

// パスがprotectedRoutesリスト内のいずれかのパスで始まるかチェックする関数
function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  // 現在のパスを取得
  const path = event.url.pathname;
  
  // クッキーからトークンを取得
  const authCookie = event.cookies.get('user');
  
  // 保護されたルートかつ認証されていない場合はログインページにリダイレクト
  if (isProtectedRoute(path) && !authCookie) {
    redirect(302, '/login');
  }
  
  // ログインページにすでにログインしている場合はダッシュボードにリダイレクト
  if (path === '/login' && authCookie) {
    redirect(302, '/');
  }
  
  // 通常の処理を継続
  const response = await resolve(event);
  return response;
};