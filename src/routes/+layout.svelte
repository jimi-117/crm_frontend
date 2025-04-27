<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/authStore";
  import { logout } from "$lib/api/auth";

  let darkMode = false;
  let mobileMenuOpen = false;

  onMount(() => {
    const savedTheme = localStorage.getItem("theme");
    darkMode = savedTheme === "dark";
    applyTheme();
  });

  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    applyTheme();
  }

  function applyTheme() {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function handleLogout() {
    logout();
    goto("/login");
  }

  $: isLoggedIn = !!$authStore;
  $: isLoginPage = $page.url.pathname === "/login";
</script>

{#if isLoggedIn && !isLoginPage}
  <div class="min-h-screen flex flex-col">
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative flex justify-between h-16">
          <!-- Logo and Desktop Navigation -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-xl font-bold text-primary-500">CRM</span>
            </div>
            <nav class="hidden md:flex ml-6 space-x-4 lg:space-x-8">
              <a
                href="/"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm lg:text-base {$page
                  .url.pathname === '/'
                  ? 'border-primary-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}"
              >
                Tableau de bord
              </a>
              <a
                href="/clients"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm lg:text-base {$page.url.pathname.startsWith(
                  '/clients'
                )
                  ? 'border-primary-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}"
              >
                Clients
              </a>
              <a
                href="/prospects"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm lg:text-base {$page.url.pathname.startsWith(
                  '/prospects'
                )
                  ? 'border-primary-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}"
              >
                Prospects
              </a>
              <a
                href="/statistics"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm lg:text-base {$page.url.pathname.startsWith(
                  '/statistics'
                )
                  ? 'border-primary-500 text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'}"
              >
                Statistiques
              </a>
            </nav>
          </div>

          <!-- Mobile menu button -->
          <div class="flex md:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              on:click={toggleMobileMenu}
            >
              <span class="sr-only">Open main menu</span>
              {#if mobileMenuOpen}
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              {:else}
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              {/if}
            </button>
          </div>

          <!-- Desktop right navigation -->
          <div class="hidden md:flex items-center space-x-4">
            <button
              type="button"
              class="bg-gray-200 dark:bg-gray-700 p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              on:click={toggleDarkMode}
              aria-label="Basculer le mode sombre"
            >
              {#if darkMode}
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              {:else}
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              {/if}
            </button>
            <div class="relative">
              <div
                class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white"
              >
                {$authStore?.email?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            <button
              type="button"
              class="btn-secondary text-sm"
              on:click={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        {#if mobileMenuOpen}
          <div class="md:hidden" transition:fade={{ duration: 200 }}>
            <div class="pt-2 pb-3 space-y-1">
              <a
                href="/"
                class="block px-3 py-2 rounded-md text-base font-medium {$page
                  .url.pathname === '/'
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}"
              >
                Tableau de bord
              </a>
              <a
                href="/clients"
                class="block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname.startsWith(
                  '/clients'
                )
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}"
              >
                Clients
              </a>
              <a
                href="/prospects"
                class="block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname.startsWith(
                  '/prospects'
                )
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}"
              >
                Prospects
              </a>
              <a
                href="/statistics"
                class="block px-3 py-2 rounded-md text-base font-medium {$page.url.pathname.startsWith(
                  '/statistics'
                )
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}"
              >
                Statistiques
              </a>
            </div>
            <div
              class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center px-3">
                <div
                  class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white"
                >
                  {$authStore?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div class="ml-3">
                  <div
                    class="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {$authStore?.email || ""}
                  </div>
                </div>
              </div>
              <div class="mt-3 space-y-1">
                <button
                  type="button"
                  class="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  on:click={toggleDarkMode}
                >
                  {darkMode ? "Mode clair" : "Mode sombre"}
                </button>
                <button
                  type="button"
                  class="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  on:click={handleLogout}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </header>

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div in:fade={{ duration: 200, delay: 150 }}>
        <slot />
      </div>
    </main>
  </div>
{:else}
  <div in:fade={{ duration: 200 }}>
    <slot />
  </div>
{/if}
