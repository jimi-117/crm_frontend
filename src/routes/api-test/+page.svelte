<!-- src/routes/api-test/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { API_BASE_URL } from '$lib/api/config';
    
    let apiStatus = 'テスト前';
    let apiResponse = '';
    let apiUrl = API_BASE_URL;
    
    async function testApiConnection() {
      apiStatus = 'テスト中...';
      try {
        const response = await fetch(`${apiUrl}/health`);
        const data = await response.json();
        apiStatus = response.ok ? '成功' : '失敗';
        apiResponse = JSON.stringify(data, null, 2);
      } catch (error) {
        apiStatus = 'エラー';
        apiResponse = error instanceof Error ? error.message : String(error);
        console.error('API接続テストエラー:', error);
      }
    }
    
    onMount(() => {
      console.log('API_BASE_URL:', apiUrl);
    });
  </script>
  
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">API接続テスト</h1>
    
    <div class="mb-4">
      <p>API Base URL: <code class="bg-gray-100 p-1 rounded">{apiUrl}</code></p>
    </div>
    
    <button 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
      on:click={testApiConnection}
    >
      APIテスト実行
    </button>
    
    <div class="mt-4">
      <p>ステータス: <span class={apiStatus === '成功' ? 'text-green-500' : apiStatus === 'エラー' ? 'text-red-500' : 'text-blue-500'}>{apiStatus}</span></p>
      {#if apiResponse}
        <pre class="mt-2 p-4 bg-gray-100 rounded overflow-x-auto">{apiResponse}</pre>
      {/if}
    </div>
  </div>