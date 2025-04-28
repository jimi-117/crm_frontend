import { writable } from 'svelte/store';

// Type definition for user object
interface User {
  email: string;
}

// Create a writable store with initial value of null (not logged in)
export const authStore = writable<User | null>(null);