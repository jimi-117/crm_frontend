<script lang="ts">
  import { onMount } from "svelte";
  import { API_BASE_URL } from "$lib/api/config";

  // テスト状態
  let apiStatus = "テスト前";
  let apiResponse = "";
  let apiUrl = API_BASE_URL;
  let healthEndpoint = "/health";
  let tokenEndpoint = "/token";
  let testEndpoint = healthEndpoint;
  let testCredentials = {
    username: "test@example.com",
    password: "password123",
  };

  // 環境変数の状態
  let envVars = {
    apiBaseUrl: API_BASE_URL,
  };

  // 単純なGETリクエストでAPIの基本的な接続をテスト
  async function testApiConnection() {
    const url = `${apiUrl}${testEndpoint}`;
    apiStatus = "テスト中...";
    apiResponse = "";

    try {
      console.log(`Testing API connection to: ${url}`);
      const response = await fetch(url);
      apiStatus = response.ok ? "成功" : `失敗 (${response.status})`;

      try {
        const data = await response.json();
        apiResponse = JSON.stringify(data, null, 2);
      } catch (e) {
        try {
          apiResponse = await response.text();
        } catch (e2) {
          apiResponse = "レスポンスの解析に失敗しました";
        }
      }
    } catch (error) {
      apiStatus = "エラー";
      apiResponse = error instanceof Error ? error.message : String(error);
      console.error("API接続テストエラー:", error);
    }
  }

  // トークンエンドポイントをテスト（ログイン機能）
  async function testTokenEndpoint() {
    const url = `${apiUrl}${tokenEndpoint}`;
    apiStatus = "テスト中...";
    apiResponse = "";

    try {
      console.log(`Testing token endpoint: ${url}`);
      const formData = new FormData();
      formData.append("username", testCredentials.username);
      formData.append("password", testCredentials.password);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      apiStatus = response.ok ? "成功" : `失敗 (${response.status})`;

      try {
        const data = await response.json();
        apiResponse = JSON.stringify(data, null, 2);
      } catch (e) {
        try {
          apiResponse = await response.text();
        } catch (e2) {
          apiResponse = "レスポンスの解析に失敗しました";
        }
      }
    } catch (error) {
      apiStatus = "エラー";
      apiResponse = error instanceof Error ? error.message : String(error);
      console.error("トークンエンドポイントテストエラー:", error);
    }
  }

  onMount(() => {
    console.log("環境変数:");
    console.log("API_BASE_URL:", apiUrl);
  });
</script>

<div class="p-8">
  <h1 class="text-2xl font-bold mb-4">API接続診断ツール</h1>

  <div class="mb-6 p-4 rounded bg-gray-100 dark:bg-gray-800">
    <h2 class="text-lg font-semibold mb-2">環境設定</h2>
    <div class="mb-2">
      <p>
        <strong>API Base URL:</strong>
        <code class="bg-gray-200 dark:bg-gray-700 p-1 rounded"
          >{apiUrl || "未設定"}</code
        >
      </p>
      {#if !apiUrl}
        <p class="text-red-500 mt-1">
          警告: API_BASE_URLが設定されていません。環境変数を確認してください。
        </p>
      {/if}
    </div>

    <div class="mb-2">
      <label class="block mb-1">テスト用エンドポイント:</label>
      <select
        bind:value={testEndpoint}
        class="w-full p-2 border rounded dark:bg-gray-700"
      >
        <option value="/health">ヘルスチェック (/health)</option>
        <option value="/token">認証トークン (/token)</option>
        <option value="/">ルートエンドポイント (/)</option>
      </select>
    </div>

    {#if testEndpoint === "/token"}
      <div class="mt-2 p-3 border rounded">
        <h3 class="text-md font-semibold mb-2">テスト認証情報</h3>
        <div class="mb-2">
          <label class="block mb-1 text-sm">ユーザー名:</label>
          <input
            bind:value={testCredentials.username}
            class="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>
        <div class="mb-2">
          <label class="block mb-1 text-sm">パスワード:</label>
          <input
            type="password"
            bind:value={testCredentials.password}
            class="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>
      </div>
    {/if}
  </div>

  <div class="flex space-x-4">
    {#if testEndpoint === "/token"}
      <button
        class="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        on:click={testTokenEndpoint}
      >
        認証テスト実行
      </button>
    {:else}
      <button
        class="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
        on:click={testApiConnection}
      >
        API接続テスト実行
      </button>
    {/if}
  </div>

  <div class="mt-6">
    <h2 class="text-lg font-semibold mb-2">テスト結果</h2>
    <p>
      ステータス: <span
        class={apiStatus === "成功"
          ? "text-green-500"
          : apiStatus === "テスト前"
            ? "text-gray-500"
            : apiStatus === "テスト中..."
              ? "text-blue-500"
              : "text-red-500"}>{apiStatus}</span
      >
    </p>

    {#if apiResponse}
      <div class="mt-2">
        <h3 class="text-md font-semibold mb-1">レスポンス:</h3>
        <pre
          class="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto border">{apiResponse}</pre>
      </div>
    {/if}
  </div>

  <div class="mt-8 p-4 border rounded">
    <h2 class="text-lg font-semibold mb-2">トラブルシューティング</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li>
        <strong>404エラー:</strong> APIエンドポイントが存在しないか、URLが間違っています。
        バックエンドが正しくデプロイされているか確認してください。
      </li>
      <li>
        <strong>CORS エラー:</strong> バックエンドのCORS設定がフロントエンドのオリジンを許可しているか確認してください。
      </li>
      <li>
        <strong>認証エラー:</strong> 認証情報が正しいか、バックエンドの認証システムが機能しているか確認してください。
      </li>
      <li>
        <strong>URL形式:</strong>
        API_BASE_URLには完全なURL(https://含む)が必要です。例:
        <code>https://crm-backend-dhpo.onrender.com</code>
      </li>
    </ul>
  </div>
</div>
