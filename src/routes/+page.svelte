<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/authStore";
  import { fade } from "svelte/transition";

  // 利用可能な都市のリスト
  const availableCities = ["paris", "lyon", "rennes"];

  let backgroundImage = "/images/rennes.jpg"; // デフォルト画像のパス（publicディレクトリを基準）

  onMount(() => {
    if (!$authStore) {
      goto("/login");
      return;
    }

    // authStoreからユーザーの都市を取得
    if ($authStore && $authStore.city) {
      const userCity = $authStore.city.toLowerCase();

      // 都市名が利用可能なリストにあるか確認
      if (availableCities.includes(userCity)) {
        backgroundImage = `/images/${userCity}.jpg`;
      } else {
        console.log(`City image not found for: ${userCity}, using default`);
      }
    }
  });
</script>

<svelte:head>
  <title>Tableau de bord | Plateforme CRM</title>
</svelte:head>

<div
  class="relative min-h-screen w-full"
  style="background-image: url('{backgroundImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;"
>
  <div class="absolute inset-0 bg-gray-100/80 dark:bg-gray-900/80">
    <div
      class="container mx-auto px-4 py-5 sm:px-6 lg:px-8"
      in:fade={{ duration: 300, delay: 150 }}
    >
      <h1
        class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
      >
        Bienvenue sur votre tableau de bord CRM
      </h1>
      <p
        class="mt-1 max-w-2xl text-sm md:text-base text-gray-500 dark:text-gray-400"
      >
        {#if $authStore && $authStore.city}
          Votre bureau: {$authStore.city}
        {/if}
      </p>
    </div>

    <div
      class="container mx-auto grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6 px-4 sm:px-6 lg:px-8"
    >
      <a
        href="/clients"
        class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 hover:scale-105 transform transition-transform duration-200"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div class="ml-4 sm:ml-5">
            <h3
              class="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
            >
              Clients
            </h3>
            <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Gérer votre base de clients
            </p>
          </div>
        </div>
      </a>

      <a
        href="/prospects"
        class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 hover:scale-105 transform transition-transform duration-200"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 bg-secondary-100 dark:bg-secondary-900 rounded-md p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 sm:h-6 sm:w-6 text-secondary-600 dark:text-secondary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div class="ml-4 sm:ml-5">
            <h3
              class="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
            >
              Prospects
            </h3>
            <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Suivre les opportunités potentielles
            </p>
          </div>
        </div>
      </a>

      <a
        href="/statistics"
        class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 hover:scale-105 transform transition-transform duration-200"
      >
        <div class="flex items-center">
          <div
            class="flex-shrink-0 bg-accent-100 dark:bg-accent-900 rounded-md p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 sm:h-6 sm:w-6 text-accent-600 dark:text-accent-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div class="ml-4 sm:ml-5">
            <h3
              class="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
            >
              Statistiques
            </h3>
            <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Analyser la performance de votre entreprise
            </p>
          </div>
        </div>
      </a>
    </div>

    <div class="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
      <div class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6">
        <h2
          class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4"
        >
          Actions rapides
        </h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a href="/clients/add" class="btn-primary text-sm sm:text-base">
            Ajouter un client
          </a>
          <a href="/prospects/add" class="btn-primary text-sm sm:text-base">
            Ajouter un prospect
          </a>
          <a href="/clients" class="btn-secondary text-sm sm:text-base">
            Voir tous les clients
          </a>
          <a href="/prospects" class="btn-secondary text-sm sm:text-base">
            Voir tous les prospects
          </a>
        </div>
      </div>
    </div>

    <div class="container mx-auto mt-8 px-4 sm:px-6 lg:px-8 pb-8">
      <div class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6">
        <h2
          class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4"
        >
          Activités récentes
        </h2>
        <div class="overflow-hidden shadow-sm rounded-lg">
          <div class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <div class="bg-white/95 dark:bg-gray-800/95">
              <div
                class="p-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
              >
                Vos activités récentes apparaîtront ici.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
