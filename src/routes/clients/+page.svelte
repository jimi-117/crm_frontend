<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import { mockClients, getClientStatusName, getClientStatusColorClass } from '$lib/data/mockData';
  import type { Client } from '$lib/types';
  
  let clients: Client[] = [];
  let filteredClients: Client[] = [];
  let searchTerm = '';
  let statusFilter = 'all';
  
  onMount(() => {
    // Redirect to login if not authenticated
    if (!$authStore) {
      goto('/login');
      return;
    }
    
    // Load mock data
    clients = [...mockClients];
    filteredClients = [...clients];
  });
  
  // Filter clients based on search term and status
  $: {
    filteredClients = clients.filter(client => {
      const matchesSearch = 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }
  
  // Sort clients by name function
  function sortByName() {
    filteredClients = [...filteredClients].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }
  
  // Sort clients by company function
  function sortByCompany() {
    filteredClients = [...filteredClients].sort((a, b) => 
      a.company.localeCompare(b.company)
    );
  }
  
  // Sort clients by status function
  function sortByStatus() {
    filteredClients = [...filteredClients].sort((a, b) => 
      a.status.localeCompare(b.status)
    );
  }
  
  // Delete client function
  function deleteClient(id: string) {
    if (confirm('Are you sure you want to delete this client?')) {
      clients = clients.filter(client => client.id !== id);
      filteredClients = filteredClients.filter(client => client.id !== id);
    }
  }
</script>

<svelte:head>
  <title>Clients | CRM Platform</title>
</svelte:head>

<div class="px-4 py-5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between">
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      Clients
    </h1>
    <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
      Gérez et suivez tous vos clients
    </p>
  </div>
  <div class="mt-4 md:mt-0">
    <a 
      href="/clients/add" 
      class="btn-primary"
    >
      <svg class="mr-1 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Ajouter un nouveau client
    </a>
  </div>
</div>

<div class="card mt-5">
  <div class="p-4 sm:p-6">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="w-full md:w-2/3">
        <label for="search" class="sr-only">Rechercher</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="search"
            type="search"
            class="input pl-10"
            placeholder="Search clients..."
            bind:value={searchTerm}
          />
        </div>
      </div>

      <div class="w-full md:w-1/3">
        <label for="status-filter" class="sr-only">Filter by Status</label>
        <select
          id="status-filter"
          class="input"
          bind:value={statusFilter}
        >
          <option value="all">Tous les statuts</option>
          <option value="contacted">Contacté</option>
          <option value="not_responded">Pas de réponse</option>
          <option value="meeting_scheduled">Réunion programmée</option>
          <option value="proposal_sent">Proposition envoyée</option>
          <option value="negotiation">Négociation en cours</option>
          <option value="closed_won">Clôturé (positive)</option>
          <option value="closed_lost">Clôturé (négative)</option>
        </select>
      </div>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" on:click={sortByName}>
            Nom
            <svg class="inline-block ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" on:click={sortByCompany}>
            Entreprise
            <svg class="inline-block ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Contacte
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Type d'offre
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" on:click={sortByStatus}>
            Status
            <svg class="inline-block ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {#if filteredClients.length === 0}
          <tr>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" colspan="6">
              Aucun client trouvé. Essayez d'ajuster votre recherche ou vos filtres.
            </td>
          </tr>
        {:else}
          {#each filteredClients as client}
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{client.name}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{client.company}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">{client.email}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{client.phone}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{client.offerType}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getClientStatusColorClass(client.status)}">
                  {getClientStatusName(client.status)}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2 justify-end">
                  <a 
                    href={`/clients/${client.id}`} 
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <span class="sr-only">View</span>
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </a>
                  <a 
                    href={`/clients/${client.id}/edit`} 
                    class="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                  >
                    <span class="sr-only">Edit</span>
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </a>
                  <button 
                    type="button" 
                    class="text-error hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    on:click={() => deleteClient(client.id)}
                  >
                    <span class="sr-only">Delete</span>
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
</div>