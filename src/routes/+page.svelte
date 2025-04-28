<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/authStore";
  import { fade } from "svelte/transition";
  import { clientsApi } from "$lib/api/clients";
  import { prospectsApi } from "$lib/api/prospects";
  import { contentItemsApi } from "$lib/api/contentItems";
  import { statisticsApi } from "$lib/api/statistics";

  // 利用可能な都市のリスト
  const availableCities = ["paris", "lyon", "rennes"];

  // バックグラウンド画像
  let backgroundImage = "/images/rennes.jpg"; // デフォルト画像のパス

  interface Activity {
    type: "client" | "prospect";
    id: number;
    name: string;
    company: string | null;
    date: Date;
    action: string;
  }

  // データ
  let clientsCount = 0;
  let prospectsCount = 0;
  let videosCount = 0;
  let closingRate = 0;

  // ローディング状態
  let loading = true;
  let error = "";

  // 最近の活動（例：最新のクライアントやプロスペクト）
  let recentActivities: Activity[] = [];

  onMount(async () => {
    if (!$authStore) {
      goto("/login");
      return;
    }

    // 地域に基づく背景画像の設定
    if ($authStore && $authStore.city) {
      const userCity = $authStore.city.toLowerCase();
      if (availableCities.includes(userCity)) {
        backgroundImage = `/images/${userCity}.jpg`;
      } else {
        console.log(`City image not found for: ${userCity}, using default`);
      }
    }

    try {
      loading = true;

      // 統計データの取得
      const stats = await statisticsApi.getDashboardStats();
      clientsCount = stats.totalClients;
      prospectsCount = stats.totalProspects;
      videosCount = stats.totalVideosPublished;
      closingRate = stats.closingRate;

      // 最近の活動を取得
      await fetchRecentActivities();

      loading = false;
    } catch (err) {
      loading = false;
      console.error("Error loading dashboard data:", err);
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = "Une erreur est survenue lors du chargement des données";
      }
    }
  });

  // 最近の活動を取得（最新のクライアントとプロスペクト）
  async function fetchRecentActivities() {
    try {
      // 最新のクライアント5件を取得
      const clients = await clientsApi.getClients();
      const recentClients = clients
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3)
        .map((client) => ({
          type: "client" as const,
          id: client.id,
          name: client.name,
          company: client.company_name,
          date: new Date(client.created_at),
          action: "Nouveau client",
        }));

      // 最新のプロスペクト5件を取得
      const prospects = await prospectsApi.getProspects();
      const recentProspects = prospects
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 3)
        .map((prospect) => ({
          type: "prospect" as const,
          id: prospect.id,
          name: prospect.name,
          company: prospect.company_name,
          date: new Date(prospect.created_at),
          action: "Nouveau prospect",
        }));

      // 活動を結合してソート
      recentActivities = [...recentClients, ...recentProspects]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);
    } catch (err) {
      console.error("Error fetching recent activities:", err);
    }
  }

  // 日付のフォーマット
  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
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

    {#if error}
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div class="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400 dark:text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                {error}
              </h3>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <div
      class="container mx-auto grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6 px-4 sm:px-6 lg:px-8"
    >
      <!-- クライアント -->
      <div
        class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 hover:scale-105 transform transition-transform duration-200"
      >
        <div class="flex justify-between items-start">
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
            </div>
          </div>

          {#if loading}
            <div
              class="h-10 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
            ></div>
          {:else}
            <span
              class="text-2xl font-bold text-primary-600 dark:text-primary-400"
              >{clientsCount}</span
            >
          {/if}
        </div>

        <div class="mt-4">
          <a
            href="/clients"
            class="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
          >
            Voir tous les clients →
          </a>
        </div>
      </div>

      <!-- プロスペクト -->
      <div
        class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 hover:scale-105 transform transition-transform duration-200"
      >
        <div class="flex justify-between items-start">
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
            </div>
          </div>

          {#if loading}
            <div
              class="h-10 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
            ></div>
          {:else}
            <span
              class="text-2xl font-bold text-secondary-600 dark:text-secondary-400"
              >{prospectsCount}</span
            >
          {/if}
        </div>

        <div class="mt-4">
          <a
            href="/prospects"
            class="text-secondary-600 dark:text-secondary-400 text-sm font-medium hover:underline"
          >
            Voir tous les prospects →
          </a>
        </div>
      </div>

      <!-- 動画 -->
      <div
        class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 hover:scale-105 transform transition-transform duration-200"
      >
        <div class="flex justify-between items-start">
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
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div class="ml-4 sm:ml-5">
              <h3
                class="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
              >
                Vidéos
              </h3>
            </div>
          </div>

          {#if loading}
            <div
              class="h-10 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
            ></div>
          {:else}
            <span
              class="text-2xl font-bold text-accent-600 dark:text-accent-400"
              >{videosCount}</span
            >
          {/if}
        </div>

        <div class="mt-4">
          <a
            href="/content"
            class="text-accent-600 dark:text-accent-400 text-sm font-medium hover:underline"
          >
            Gérer le contenu →
          </a>
        </div>
      </div>

      <!-- 成約率 -->
      <div
        class="card bg-white/90 dark:bg-gray-800/90 p-4 sm:p-6 hover:scale-105 transform transition-transform duration-200"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center">
            <div
              class="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-4 sm:ml-5">
              <h3
                class="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
              >
                Taux de succès
              </h3>
            </div>
          </div>

          {#if loading}
            <div
              class="h-10 w-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
            ></div>
          {:else}
            <span class="text-2xl font-bold text-green-600 dark:text-green-400"
              >{closingRate}%</span
            >
          {/if}
        </div>

        <div class="mt-4">
          <a
            href="/statistics"
            class="text-green-600 dark:text-green-400 text-sm font-medium hover:underline"
          >
            Voir les statistiques →
          </a>
        </div>
      </div>
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
            <svg
              class="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Ajouter un client
          </a>
          <a href="/prospects/add" class="btn-primary text-sm sm:text-base">
            <svg
              class="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Ajouter un prospect
          </a>
          <a href="/statistics" class="btn-secondary text-sm sm:text-base">
            <svg
              class="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
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
            Statistiques
          </a>
          <a href="/calendar" class="btn-secondary text-sm sm:text-base">
            <svg
              class="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Calendrier
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
            {#if loading}
              <div class="p-4 space-y-3">
                {#each Array(3) as _, i}
                  <div class="flex space-x-4 animate-pulse">
                    <div
                      class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"
                    ></div>
                    <div class="flex-1 py-1 space-y-2">
                      <div
                        class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"
                      ></div>
                      <div
                        class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"
                      ></div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else if recentActivities.length === 0}
              <div class="bg-white/95 dark:bg-gray-800/95">
                <div
                  class="p-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                >
                  Aucune activité récente à afficher.
                </div>
              </div>
            {:else}
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                {#each recentActivities as activity}
                  <li
                    class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        {#if activity.type === "client"}
                          <div
                            class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                          >
                            <svg
                              class="h-6 w-6 text-primary-600 dark:text-primary-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        {:else}
                          <div
                            class="h-10 w-10 rounded-full bg-secondary-100 dark:bg-secondary-900 flex items-center justify-center"
                          >
                            <svg
                              class="h-6 w-6 text-secondary-600 dark:text-secondary-400"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                        {/if}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p
                          class="text-sm font-medium text-gray-900 dark:text-white truncate"
                        >
                          {activity.action}: {activity.name}
                        </p>
                        <p
                          class="text-sm text-gray-500 dark:text-gray-400 truncate"
                        >
                          {activity.company || "Entreprise non spécifiée"}
                        </p>
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(activity.date)}
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
