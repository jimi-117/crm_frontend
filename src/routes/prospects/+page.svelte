<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/authStore";
  import { prospectsApi } from "$lib/api/prospects";
  import {
    getProspectStatusName,
    getInterestLevelName,
    getProspectStatusColorClass,
    getProspectInterestColorClass,
  } from "$lib/data/mockData";
  import type { Prospect } from "$lib/types";
  import { format } from "date-fns";
  import { fr } from "date-fns/locale";

  let prospects: Prospect[] = [];
  let filteredProspects: Prospect[] = [];
  let recommendedProspects: Prospect[] = [];
  let searchTerm = "";
  let statusFilter = "all";
  let interestFilter = "all";
  let loading = true;
  let recommendedLoading = true;
  let error = "";

  onMount(async () => {
    if (!$authStore) {
      goto("/login");
      return;
    }

    try {
      // 通常のプロスペクト一覧を取得
      loading = true;
      prospects = await prospectsApi.getProspects();
      filteredProspects = [...prospects];
      loading = false;

      // おすすめプロスペクトを取得
      recommendedLoading = true;
      recommendedProspects = await prospectsApi.getRecommendedProspects();
      recommendedLoading = false;
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = "Une erreur est survenue lors du chargement des prospects";
      }
      loading = false;
      recommendedLoading = false;
    }
  });

  $: {
    filteredProspects = prospects.filter((prospect) => {
      const matchesSearch =
        prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prospect.company_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false) ||
        (prospect.contact_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ??
          false);

      const matchesStatus =
        statusFilter === "all" || prospect.status === statusFilter;
      const matchesInterest =
        interestFilter === "all" || prospect.interest_level === interestFilter;

      return matchesSearch && matchesStatus && matchesInterest;
    });
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch (e) {
      return dateString;
    }
  }

  function sortByName() {
    filteredProspects = [...filteredProspects].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  function sortByCompany() {
    filteredProspects = [...filteredProspects].sort((a, b) =>
      (a.company_name ?? "").localeCompare(b.company_name ?? "")
    );
  }

  function sortByDate() {
    filteredProspects = [...filteredProspects].sort((a, b) => {
      if (!a.next_follow_up_date) return 1;
      if (!b.next_follow_up_date) return -1;
      return (
        new Date(a.next_follow_up_date).getTime() -
        new Date(b.next_follow_up_date).getTime()
      );
    });
  }

  async function deleteProspect(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) {
      try {
        await prospectsApi.deleteProspect(id);
        prospects = prospects.filter((prospect) => prospect.id !== id);
        filteredProspects = filteredProspects.filter(
          (prospect) => prospect.id !== id
        );
        recommendedProspects = recommendedProspects.filter(
          (prospect) => prospect.id !== id
        );
      } catch (err) {
        if (err instanceof Error) {
          error = err.message;
        } else {
          error = "Une erreur est survenue lors de la suppression du prospect";
        }
      }
    }
  }
</script>

<svelte:head>
  <title>Prospects | Plateforme CRM</title>
</svelte:head>

<div
  class="px-4 py-5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between"
>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Prospects</h1>
    <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
      Suivre et gérer les clients potentiels
    </p>
  </div>
  <div class="mt-4 md:mt-0">
    <a href="/prospects/add" class="btn-primary">
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
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      Ajouter un nouveau prospect
    </a>
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

<!-- Recommended Prospects Section -->
<div class="mt-5">
  <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
    Prospects recommandés
  </h2>

  {#if recommendedLoading}
    <div class="flex justify-center py-6">
      <svg
        class="animate-spin h-8 w-8 text-primary-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  {:else if recommendedProspects.length === 0}
    <div class="card p-6 text-center">
      <p class="text-gray-500 dark:text-gray-400">
        Aucun prospect recommandé pour le moment.
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {#each recommendedProspects as prospect}
        <div
          class="card p-4 hover:shadow-card-hover transition-shadow duration-200"
        >
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {prospect.name}
            </h3>
            <span
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getProspectInterestColorClass(
                prospect.interest_level || 'medium'
              )}"
            >
              {getInterestLevelName(prospect.interest_level || "medium")}
            </span>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {prospect.company_name || "N/A"} - {prospect.business_category}
          </p>

          <div class="mt-3 flex flex-col space-y-2">
            <div class="flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span class="text-gray-600 dark:text-gray-300"
                >{prospect.contact_email || "N/A"}</span
              >
            </div>
            <div class="flex items-center text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-400 mr-2"
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
              <span class="text-gray-600 dark:text-gray-300">
                Suivi: {formatDate(prospect.next_follow_up_date)}
              </span>
            </div>
          </div>

          <div class="mt-4 flex justify-between">
            <span
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getProspectStatusColorClass(
                prospect.status
              )}"
            >
              {getProspectStatusName(prospect.status)}
            </span>
            <div class="flex space-x-2">
              <a
                href={`/prospects/${prospect.id}`}
                class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <span class="sr-only">Voir</span>
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </a>
              <a
                href={`/prospects/${prospect.id}/edit`}
                class="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
              >
                <span class="sr-only">Modifier</span>
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<div class="card mt-5">
  <div class="p-4 sm:p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="search" class="sr-only">Rechercher</label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            id="search"
            type="search"
            class="input pl-10"
            placeholder="Rechercher des prospects..."
            bind:value={searchTerm}
          />
        </div>
      </div>

      <div>
        <label for="status-filter" class="sr-only">Filtrer par statut</label>
        <select id="status-filter" class="input" bind:value={statusFilter}>
          <option value="all">Tous les statuts</option>
          <option value="new">Nouveau</option>
          <option value="contacted">Contacté</option>
          <option value="qualified">Qualifié</option>
          <option value="converted">Converti</option>
          <option value="disqualified">Disqualifié</option>
        </select>
      </div>

      <div>
        <label for="interest-filter" class="sr-only">Filtrer par intérêt</label>
        <select id="interest-filter" class="input" bind:value={interestFilter}>
          <option value="all">Tous les niveaux d'intérêt</option>
          <option value="high">Élevé</option>
          <option value="medium">Moyen</option>
          <option value="low">Faible</option>
        </select>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-12">
      <svg
        class="animate-spin h-8 w-8 text-primary-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              on:click={sortByName}
            >
              Nom
              <svg
                class="inline-block ml-1 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              on:click={sortByCompany}
            >
              Entreprise
              <svg
                class="inline-block ml-1 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Contact
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Intérêt
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Statut
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              on:click={sortByDate}
            >
              Suivi
              <svg
                class="inline-block ml-1 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
        >
          {#if filteredProspects.length === 0}
            <tr>
              <td
                class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                colspan="7"
              >
                Aucun prospect trouvé. Essayez d'ajuster votre recherche ou vos
                filtres.
              </td>
            </tr>
          {:else}
            {#each filteredProspects as prospect}
              <tr
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {prospect.name}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {prospect.company_name || "-"}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {prospect.business_category}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {prospect.contact_email || "-"}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {prospect.contact_phone || "-"}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getProspectInterestColorClass(
                      prospect.interest_level || 'medium'
                    )}"
                  >
                    {getInterestLevelName(prospect.interest_level || "medium")}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getProspectStatusColorClass(
                      prospect.status
                    )}"
                  >
                    {getProspectStatusName(prospect.status)}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {formatDate(prospect.next_follow_up_date)}
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <div class="flex space-x-2 justify-end">
                    <a
                      href={`/prospects/${prospect.id}`}
                      class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <span class="sr-only">Voir</span>
                      <svg
                        class="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </a>
                    <a
                      href={`/prospects/${prospect.id}/edit`}
                      class="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                    >
                      <span class="sr-only">Modifier</span>
                      <svg
                        class="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </a>
                    <button
                      type="button"
                      class="text-error hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      on:click={() => deleteProspect(prospect.id)}
                    >
                      <span class="sr-only">Supprimer</span>
                      <svg
                        class="w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  {/if}
</div>
