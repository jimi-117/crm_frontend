<script lang="ts">
  import { authStore } from "$lib/stores/authStore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { login } from "$lib/api/auth";
  import { API_BASE_URL } from "$lib/api/config";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;
  let showPassword = false;
  let showDebugInfo = false;

  // デバッグ情報
  let apiBaseUrl = API_BASE_URL;
  let browserInfo = {
    userAgent: "",
    language: "",
    online: true,
    platform: "",
  };

  onMount(() => {
    if ($authStore) {
      goto("/");
    }

    // ブラウザ情報を収集（デバッグ用）
    if (typeof window !== "undefined") {
      browserInfo.userAgent = window.navigator.userAgent;
      browserInfo.language = window.navigator.language;
      browserInfo.online = window.navigator.onLine;
      browserInfo.platform = window.navigator.platform;
    }
  });

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function toggleDebugInfo() {
    showDebugInfo = !showDebugInfo;
  }

  function handlePasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    password = input.value;
  }

  async function handleLogin() {
    if (!email || !password) {
      error = "Veuillez saisir votre email et votre mot de passe";
      return;
    }

    loading = true;
    error = "";

    try {
      // 実際のAPIを呼び出す
      await login({ email, password });

      // ログイン成功
      goto("/");
    } catch (err) {
      // エラーメッセージの設定
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = "Une erreur est survenue lors de la connexion";
      }
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Connexion | Plateforme CRM</title>
</svelte:head>

<div
  class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
>
  <div class="max-w-md w-full space-y-8">
    <div in:fade={{ duration: 300, delay: 150 }}>
      <h1
        class="text-center text-3xl font-extrabold text-gray-900 dark:text-white"
      >
        Plateforme CRM
      </h1>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Connectez-vous à votre compte
      </p>
    </div>
    <div class="card p-8" in:fly={{ y: 20, duration: 300, delay: 200 }}>
      <form class="space-y-6" on:submit|preventDefault={handleLogin}>
        {#if error}
          <div class="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400 dark:text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
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

        <div>
          <label for="email" class="label">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="input"
            bind:value={email}
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label for="password" class="label">Mot de passe</label>
          <div class="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autocomplete="current-password"
              required
              class="input pr-10"
              value={password}
              on:input={handlePasswordInput}
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
              on:click={togglePasswordVisibility}
            >
              {#if showPassword}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
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
              {/if}
            </button>
          </div>
        </div>

        <div>
          <button type="submit" class="w-full btn-primary" disabled={loading}>
            {#if loading}
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
              Connexion en cours...
            {:else}
              Se connecter
            {/if}
          </button>
        </div>
      </form>

      <!-- デバッグ情報ボタン - 開発またはテスト環境でのみ表示 -->
      <div class="mt-4 text-center">
        <button
          type="button"
          class="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          on:click={toggleDebugInfo}
        >
          {showDebugInfo ? "Masquer" : "Afficher"} les informations de débogage
        </button>
      </div>

      <!-- デバッグ情報 -->
      {#if showDebugInfo}
        <div
          class="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs overflow-hidden"
          transition:fade
        >
          <h3 class="font-medium mb-2">Informations de débogage</h3>

          <div class="mb-2">
            <p class="font-medium">API:</p>
            <p class="ml-2 break-all">Base URL: {apiBaseUrl || "Non défini"}</p>
          </div>

          <div class="mb-2">
            <p class="font-medium">Navigateur:</p>
            <p class="ml-2">User Agent: {browserInfo.userAgent}</p>
            <p class="ml-2">Langue: {browserInfo.language}</p>
            <p class="ml-2">Plateforme: {browserInfo.platform}</p>
            <p class="ml-2">En ligne: {browserInfo.online ? "Oui" : "Non"}</p>
          </div>

          <div class="mb-2">
            <p class="font-medium">Test connexion à l'API:</p>
            <div class="flex space-x-2 mt-1">
              <a
                href="/api-test"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-500 hover:underline"
              >
                Ouvrir l'outil de test d'API
              </a>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
