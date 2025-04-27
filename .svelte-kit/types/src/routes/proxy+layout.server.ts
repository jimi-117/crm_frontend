// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async ({ url, cookies }: Parameters<LayoutServerLoad>[0]) => {
  // Protected routes that require authentication
  const protectedPaths = ['/', '/clients', '/prospects', '/statistics'];
  const path = url.pathname;
  
  // Mock auth check for now - will be replaced with real backend auth later
  const isProtectedRoute = protectedPaths.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  // For login route, if already logged in, redirect to the dashboard
  if (path === '/login') {
    // This is just a mock check. In a real app, you'd check the session/token validity
    const hasUserInStorage = typeof localStorage !== 'undefined' && !!localStorage.getItem('user');
    if (hasUserInStorage) {
      redirect(302, '/');
    }
  }
  
  return {};
};