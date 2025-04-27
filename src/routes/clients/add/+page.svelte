<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/authStore";
  import { clientsApi } from "$lib/api/clients";
  import { getClientStatusOptions } from "$lib/utils/statusUtils";
  import type { ClientStatus } from "$lib/types";

  // フォームデータ
  let name = "";
  let company_name = "";
  let contact_email = "";
  let contact_phone = "";
  let business_category: "food" | "travel" | "shop" = "food";
  let status: ClientStatus = "to_do"; // デフォルト値を更新
  let signed_date: string | null = null;
  let estimated_monthly_revenue: number | null = null;
  let notes = "";

  // フォーム状態
  let submitting = false;
  let submitted = false;
  let error = "";

  // ステータスオプション
  const statusOptions = getClientStatusOptions();

  onMount(() => {
    // 認証されていない場合はログインページにリダイレクト
    if (!$authStore) {
      goto("/login");
    }
  });

  async function handleSubmit() {
    // フォームバリデーション
    if (!name || !company_name || !contact_email) {
      error = "Veuillez completer ce champ.";
      return;
    }

    submitting = true;
    error = "";

    try {
      // 新しいクライアントを作成
      await clientsApi.createClient({
        name,
        company_name,
        business_category,
        contact_email,
        contact_phone,
        status,
        signed_date,
        estimated_monthly_revenue,
      });

      // フォームをリセット
      submitted = true;

      // リダイレクト
      setTimeout(() => {
        goto("/clients");
      }, 1500);
    } catch (e) {
      console.error("Error creating client:", e);
      error =
        "Une erreur s'est produite lors de l'enregistrement du client. Veuillez réessayer.";
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Ajouter client | CRM Platform</title>
</svelte:head>

<div class="px-4 py-5 sm:px-6">
  <div class="flex items-center">
    <div class="flex-shrink-0">
      <button
        type="button"
        class="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        on:click={() => goto("/clients")}
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
        Ajouter un nouveau client
      </h1>
      <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        Remplissez les informations pour créer un nouveau client
      </p>
    </div>
  </div>
</div>

<div class="card mt-5">
  {#if submitted}
    <div class="p-6">
      <div class="rounded-md bg-green-50 dark:bg-green-900/30 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-green-400 dark:text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">
              🎉Client ajouté avec succès !🎉 Redirection en cours...
            </p>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <form class="p-6" on:submit|preventDefault={handleSubmit}>
      {#if error}
        <div class="mb-6 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
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

      <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label for="name" class="label"
            >Nom <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            id="name"
            class="input"
            bind:value={name}
            required
          />
        </div>

        <div>
          <label for="company_name" class="label"
            >Entreprise <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            id="company_name"
            class="input"
            bind:value={company_name}
            required
          />
        </div>

        <div>
          <label for="contact_email" class="label"
            >Email <span class="text-red-500">*</span></label
          >
          <input
            type="email"
            id="contact_email"
            class="input"
            bind:value={contact_email}
            required
          />
        </div>

        <div>
          <label for="contact_phone" class="label">Tél</label>
          <input
            type="tel"
            id="contact_phone"
            class="input"
            bind:value={contact_phone}
          />
        </div>

        <div>
          <label for="business_category" class="label"
            >Type d'offre <span class="text-red-500">*</span></label
          >
          <select
            id="business_category"
            class="input"
            bind:value={business_category}
            required
          >
            <option value="food">Food</option>
            <option value="travel">Travel</option>
            <option value="shop">Shop</option>
          </select>
        </div>

        <div>
          <label for="status" class="label"
            >Status <span class="text-red-500">*</span></label
          >
          <select id="status" class="input" bind:value={status} required>
            {#each statusOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label for="signed_date" class="label">Date de signature</label>
          <input
            type="date"
            id="signed_date"
            class="input"
            bind:value={signed_date}
          />
        </div>

        <div>
          <label for="estimated_monthly_revenue" class="label"
            >Revenu mensuel estimé (€)</label
          >
          <input
            type="number"
            id="estimated_monthly_revenue"
            class="input"
            bind:value={estimated_monthly_revenue}
            min="0"
            step="100"
          />
        </div>

        <div class="sm:col-span-2">
          <label for="notes" class="label">Notes</label>
          <textarea id="notes" rows="3" class="input" bind:value={notes}
          ></textarea>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          class="btn-secondary"
          on:click={() => goto("/clients")}
          disabled={submitting}
        >
          Annuler
        </button>
        <button type="submit" class="btn-primary" disabled={submitting}>
          {#if submitting}
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Enregistrement en cours...
          {:else}
            Enregistrer le client
          {/if}
        </button>
      </div>
    </form>
  {/if}
</div>
