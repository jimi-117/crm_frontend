<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/authStore";
  import { statisticsApi } from "$lib/api/statistics";
  import {
    getClientStatusName,
    getProspectStatusName,
  } from "$lib/utils/statusUtils";
  import type {
      DashboardStats,
      RevenueData,
      ClientStatusData,
      ProspectStatusData,
      ClientStatus,
      ProspectStatus,
    } from "$lib/types";
  import { Chart, registerables } from "chart.js";
  import { Bar, Doughnut, Line } from "svelte-chartjs";

  // Register Chart.js components
  Chart.register(...registerables);

  // Statistics data
  let stats: DashboardStats = {
    totalClients: 0,
    totalProspects: 0,
    totalVideosPublished: 0,
    monthlyRevenue: 0,
    closingRate: 0,
    conversionRate: 0,
  };

  // Chart data
  let revenueData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      tension: number;
      fill: boolean;
    }[];
  } = {
    labels: [],
    datasets: [
      {
        label: "Monthly Revenue (€)",
        data: [],
        backgroundColor: "rgba(10, 132, 255, 0.2)",
        borderColor: "rgba(10, 132, 255, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  let clientStatusData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  } = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "rgba(10, 132, 255, 0.7)", // Blue
          "rgba(169, 169, 169, 0.7)", // Gray
          "rgba(142, 68, 173, 0.7)", // Purple
          "rgba(241, 196, 15, 0.7)", // Yellow
          "rgba(243, 156, 18, 0.7)", // Orange
          "rgba(48, 209, 88, 0.7)", // Green
          "rgba(231, 76, 60, 0.7)", // Red
        ],
        borderWidth: 1,
      },
    ],
  };

  let prospectStatusData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
    }[];
  } = {
    labels: [],
    datasets: [
      {
        label: "Prospects by Status",
        data: [],
        backgroundColor: [
          "rgba(10, 132, 255, 0.7)", // Blue
          "rgba(142, 68, 173, 0.7)", // Purple
          "rgba(241, 196, 15, 0.7)", // Yellow
          "rgba(48, 209, 88, 0.7)", // Green
          "rgba(231, 76, 60, 0.7)", // Red
        ],
        borderWidth: 0,
      },
    ],
  };

  // ローディング状態
  let loadingStats = true;
  let loadingRevenueData = true;
  let loadingClientData = true;
  let loadingProspectData = true;

  // エラー状態
  let error = "";

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "rgb(107, 114, 128)",
        },
      },
      tooltip: {
        mode: "index" as "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: number | string) {
            if (typeof tickValue === 'number') {
              return `€${tickValue.toLocaleString()}`;
            }
            return tickValue;
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "rgb(107, 114, 128)",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { label?: string; formattedValue: string }) {
            const label = context.label || "";
            const value = context.formattedValue;
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: "65%",
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // データ取得
  async function fetchDashboardStats() {
    try {
      loadingStats = true;
      stats = await statisticsApi.getDashboardStats();
      loadingStats = false;
    } catch (err) {
      loadingStats = false;
      console.error("Error fetching dashboard stats:", err);
      error =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des statistiques";
    }
  }

  async function fetchRevenueData() {
    try {
      loadingRevenueData = true;
      const data = await statisticsApi.getRevenueData();

      // チャートデータを更新
      revenueData = {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Monthly Revenue (€)",
            data: data.map((d) => d.amount),
            backgroundColor: "rgba(10, 132, 255, 0.2)",
            borderColor: "rgba(10, 132, 255, 1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      };

      loadingRevenueData = false;
    } catch (err) {
      loadingRevenueData = false;
      console.error("Error fetching revenue data:", err);
      error =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données de revenus";
    }
  }

  async function fetchClientStatusData() {
    try {
      loadingClientData = true;
      const data = await statisticsApi.getClientStatusData();

      // ステータス名を表示用に変換
      clientStatusData = {
        labels: data.map((d) => getClientStatusName(d.status as ClientStatus)),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: [
              "rgba(10, 132, 255, 0.7)", // Blue
              "rgba(169, 169, 169, 0.7)", // Gray
              "rgba(142, 68, 173, 0.7)", // Purple
              "rgba(241, 196, 15, 0.7)", // Yellow
              "rgba(243, 156, 18, 0.7)", // Orange
              "rgba(48, 209, 88, 0.7)", // Green
              "rgba(231, 76, 60, 0.7)", // Red
            ],
            borderWidth: 1,
          },
        ],
      };

      loadingClientData = false;
    } catch (err) {
      loadingClientData = false;
      console.error("Error fetching client status data:", err);
      error =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données clients";
    }
  }

  async function fetchProspectStatusData() {
    try {
      loadingProspectData = true;
      const data = await statisticsApi.getProspectStatusData();

      // ステータス名を表示用に変換
      prospectStatusData = {
        labels: data.map((d) => getProspectStatusName(d.status as ProspectStatus)),
        datasets: [
          {
            label: "Prospects by Status",
            data: data.map((d) => d.count),
            backgroundColor: [
              "rgba(10, 132, 255, 0.7)", // Blue
              "rgba(142, 68, 173, 0.7)", // Purple
              "rgba(241, 196, 15, 0.7)", // Yellow
              "rgba(48, 209, 88, 0.7)", // Green
              "rgba(231, 76, 60, 0.7)", // Red
            ],
            borderWidth: 0,
          },
        ],
      };

      loadingProspectData = false;
    } catch (err) {
      loadingProspectData = false;
      console.error("Error fetching prospect status data:", err);
      error =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données prospects";
    }
  }

  onMount(async () => {
    // 認証チェック
    if (!$authStore) {
      goto("/login");
      return;
    }

    // 各種データの取得
    await fetchDashboardStats();
    await fetchRevenueData();
    await fetchClientStatusData();
    await fetchProspectStatusData();
  });

  // CSV出力
  function downloadRevenueCSV() {
    if (!revenueData.labels.length) return;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Month,Revenue\n" +
      revenueData.labels
        .map((month, i) => `${month},${revenueData.datasets[0].data[i]}`)
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "revenue_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<svelte:head>
  <title>Statistics | CRM Platform</title>
</svelte:head>

<div class="px-4 py-5 sm:px-6">
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Statistics
      </h1>
      <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        Track your business performance
      </p>
    </div>
    <div class="mt-4 sm:mt-0">
      <button type="button" class="btn-secondary" on:click={downloadRevenueCSV}>
        <svg
          class="mr-1 -ml-1 w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export CSV
      </button>
    </div>
  </div>
</div>

{#if error}
  <div class="mt-5 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
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
{/if}

<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-5">
  <div class="card p-5">
    <div class="flex items-center">
      <div
        class="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-md p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-primary-600 dark:text-primary-400"
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
      <div class="ml-5">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Clients
        </p>
        {#if loadingStats}
          <div
            class="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"
          ></div>
        {:else}
          <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.totalClients}
          </p>
        {/if}
      </div>
    </div>
  </div>

  <div class="card p-5">
    <div class="flex items-center">
      <div
        class="flex-shrink-0 bg-secondary-100 dark:bg-secondary-900 rounded-md p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-secondary-600 dark:text-secondary-400"
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
      <div class="ml-5">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Prospects
        </p>
        {#if loadingStats}
          <div
            class="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"
          ></div>
        {:else}
          <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.totalProspects}
          </p>
        {/if}
      </div>
    </div>
  </div>

  <div class="card p-5">
    <div class="flex items-center">
      <div
        class="flex-shrink-0 bg-accent-100 dark:bg-accent-900 rounded-md p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-accent-600 dark:text-accent-400"
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
      <div class="ml-5">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Videos Published
        </p>
        {#if loadingStats}
          <div
            class="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"
          ></div>
        {:else}
          <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.totalVideosPublished}
          </p>
        {/if}
      </div>
    </div>
  </div>

  <div class="card p-5">
    <div class="flex items-center">
      <div class="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-green-600 dark:text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="ml-5">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Monthly Revenue
        </p>
        {#if loadingStats}
          <div
            class="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"
          ></div>
        {:else}
          <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            €{stats.monthlyRevenue.toLocaleString()}
          </p>
        {/if}
      </div>
    </div>
  </div>

  <div class="card p-5">
    <div class="flex items-center">
      <div
        class="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-yellow-600 dark:text-yellow-400"
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
      <div class="ml-5">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Closing Rate
        </p>
        {#if loadingStats}
          <div
            class="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"
          ></div>
        {:else}
          <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.closingRate}%
          </p>
        {/if}
      </div>
    </div>
  </div>

  <div class="card p-5">
    <div class="flex items-center">
      <div
        class="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-purple-600 dark:text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </div>
      <div class="ml-5">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Conversion Rate
        </p>
        {#if loadingStats}
          <div
            class="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"
          ></div>
        {:else}
          <p class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {stats.conversionRate}%
          </p>
        {/if}
      </div>
    </div>
  </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
  <div class="card p-5 lg:col-span-2">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Monthly Revenue
    </h2>
    {#if loadingRevenueData}
      <div class="h-80 flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"
        ></div>
      </div>
    {:else}
      <div class="h-80">
        <Line data={revenueData} options={lineOptions} />
      </div>
    {/if}
  </div>

  <div class="card p-5">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Client Statuses
    </h2>
    {#if loadingClientData}
      <div class="h-80 flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"
        ></div>
      </div>
    {:else if clientStatusData.labels.length === 0}
      <div class="h-80 flex items-center justify-center">
        <p class="text-gray-500 dark:text-gray-400">No client data available</p>
      </div>
    {:else}
      <div class="h-80">
        <Doughnut data={clientStatusData} options={doughnutOptions} />
      </div>
    {/if}
  </div>

  <div class="card p-5 lg:col-span-3">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
      Prospect Distribution
    </h2>
    {#if loadingProspectData}
      <div class="h-80 flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"
        ></div>
      </div>
    {:else if prospectStatusData.labels.length === 0}
      <div class="h-80 flex items-center justify-center">
        <p class="text-gray-500 dark:text-gray-400">
          No prospect data available
        </p>
      </div>
    {:else}
      <div class="h-80">
        <Bar data={prospectStatusData} options={barOptions} />
      </div>
    {/if}
  </div>
</div>
