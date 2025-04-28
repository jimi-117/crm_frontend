<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authStore } from "$lib/stores/authStore";
  import { prospectsApi } from "$lib/api/prospects";
  import {
    getProspectStatusName,
    getInterestLevelName,
    getProspectStatusColorClass,
    getProspectInterestColorClass,
  } from "$lib/utils/statusUtils";
  import type { Prospect } from "$lib/types";
  import { format } from "date-fns";
  import { fr } from "date-fns/locale";

  // プロスペクトID
  let prospectId: number;
  let prospect: Prospect | null = null;
  let loading = true;
  let error = "";

  onMount(async () => {
    if (!$authStore) {
      goto("/login");
      return;
    }

    // URLからプロスペクトIDを取得
    const { id } = $page.params;
    prospectId = parseInt(id, 10);

    if (isNaN(prospectId)) {
      error = "ID de prospect invalide";
      loading = false;
      return;
    }

    try {
      // プロスペクト詳細を取得
      loading = true;
      prospect = await prospectsApi.getProspect(prospectId);
      loading = false;
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error =
          "Une erreur est survenue lors du chargement des détails du prospect";
      }
      loading = false;
    }
  });

  function formatDate(dateString: string | null) {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch (e) {
      return dateString;
    }
  }

  async function handleDelete() {
    if (!prospect) return;

    if (confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) {
      try {
        await prospectsApi.deleteProspect(prospect.id);
        goto("/prospects");
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
  <title>Détails du prospect | Plateforme CRM</title>
</svelte:head>

<div class="px-4 py-5 sm:px-6">
  <div class="flex items-center">
    <div class="flex-shrink-0">
      <button
        type="button"
        class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        on:click={() => goto("/prospects")}
      >
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
    </div>
    <div class="ml-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Détails du prospect
      </h1>
      <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        Informations complètes sur le prospect
      </p>
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
{:else if loading}
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
{:else if prospect}
  <div class="card mt-5">
    <div class="p-6">
      <!-- プロスペクトのステータスとアクション -->
      <div class="flex justify-between items-start mb-6">
        <span
          class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full {getProspectStatusColorClass(
            prospect.status
          )}"
        >
          {getProspectStatusName(prospect.status)}
        </span>
        <div class="flex space-x-3">
          <a
            href={`/prospects/${prospect.id}/edit`}
            class="btn-secondary text-sm"
          >
            <svg
              class="h-4 w-4 mr-1"
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
            Modifier
          </a>
          <button
            type="button"
            class="btn-danger text-sm"
            on:click={handleDelete}
          >
            <svg
              class="h-4 w-4 mr-1"
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
            Supprimer
          </button>
        </div>
      </div>

      <!-- プロスペクト情報 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Informations de base
          </h2>
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nom
              </p>
              <p class="mt-1 text-base text-gray-900 dark:text-white">
                {prospect.name}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Entreprise
              </p>
              <p class="mt-1 text-base text-gray-900 dark:text-white">
                {prospect.company_name || "-"}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Catégorie d'activité
              </p>
              <p class="mt-1 text-base text-gray-900 dark:text-white">
                {prospect.business_category}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Niveau d'intérêt
              </p>
              <p class="mt-1">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getProspectInterestColorClass(
                    prospect.interest_level || 'medium'
                  )}"
                >
                  {getInterestLevelName(prospect.interest_level || "medium")}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Coordonnées et suivi
          </h2>
          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p class="mt-1 text-base text-gray-900 dark:text-white">
                {prospect.contact_email || "-"}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Téléphone
              </p>
              <p class="mt-1 text-base text-gray-900 dark:text-white">
                {prospect.contact_phone || "-"}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Date de prochain suivi
              </p>
              <p class="mt-1 text-base text-gray-900 dark:text-white">
                {formatDate(prospect.next_follow_up_date)}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Date de création
              </p>
              <p class="mt-1 text-base text-gray-900 dark:text-white">
                {formatDate(prospect.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- プロスペクトのノート -->
      {#if prospect.notes}
        <div class="mt-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Notes
          </h2>
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {prospect.notes}
            </p>
          </div>
        </div>
      {/if}

      <!-- 行動ボタン -->
      <div class="mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-wrap gap-3">
          <a href="/prospects" class="btn-secondary"> Retour à la liste </a>
          <a href={`/prospects/${prospect.id}/edit`} class="btn-primary">
            Modifier le prospect
          </a>
          <!-- より多くの行動ボタンをここに追加できます -->
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="card p-6 mt-5 text-center">
    <p class="text-gray-500 dark:text-gray-400">Prospect non trouvé.</p>
  </div>
{/if}
