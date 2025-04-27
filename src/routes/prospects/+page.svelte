<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/authStore';
  import { mockProspects, getProspectStatusName, getInterestLevelName, getProspectStatusColorClass, getProspectInterestColorClass } from '$lib/data/mockData';
  import type { Prospect } from '$lib/types';
  import { format } from 'date-fns';
  import { fr } from 'date-fns/locale';
  
  let prospects: Prospect[] = [];
  let filteredProspects: Prospect[] = [];
  let searchTerm = '';
  let statusFilter = 'all';
  let interestFilter = 'all';
  
  onMount(() => {
    if (!$authStore) {
      goto('/login');
      return;
    }
    
    prospects = [...mockProspects];
    filteredProspects = [...prospects];
  });
  
  $: {
    filteredProspects = prospects.filter(prospect => {
      const matchesSearch = 
        prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prospect.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (prospect.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter;
      const matchesInterest = interestFilter === 'all' || prospect.interest_level === interestFilter;
      
      return matchesSearch && matchesStatus && matchesInterest;
    });
  }
  
  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  }
  
  function sortByName() {
    filteredProspects = [...filteredProspects].sort((a, b) => a.name.localeCompare(b.name));
  }
  
  function sortByCompany() {
    filteredProspects = [...filteredProspects].sort((a, b) => 
      (a.company_name ?? '').localeCompare(b.company_name ?? '')
    );
  }
  
  function sortByDate() {
    filteredProspects = [...filteredProspects].sort((a, b) => 
      new Date(a.next_follow_up_date ?? 0).getTime() - new Date(b.next_follow_up_date ?? 0).getTime()
    );
  }
  
  function deleteProspect(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) {
      prospects = prospects.filter(prospect => prospect.id !== id);
      filteredProspects = filteredProspects.filter(prospect => prospect.id !== id);
    }
  }
</script>

<svelte:head>
  <title>Prospects | Plateforme CRM</title>
</svelte:head>

<div class="px-4 py-5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between">
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      Prospects
    </h1>
    <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
      Suivre et gérer les clients potentiels
    </p>
  </div>
  <div class="mt-4 md:mt-0">
    <a 
      href="/prospects/add" 
      class="btn-primary"
    >
      <svg class="mr-1 -ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Ajouter un nouveau prospect
    </a>
  </div>
</div>

<div class="card mt-5">
  <div class="p-4 sm:p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
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
            placeholder="Rechercher des prospects..."
            bind:value={searchTerm}
          />
        </div>
      </div>

      <div>
        <label for="status-filter" class="sr-only">Filtrer par statut</label>
        <select
          id="status-filter"
          class="input"
          bind:value={statusFilter}
        >
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
        <select
          id="interest-filter"
          class="input"
          bind:value={interestFilter}
        >
          <option value="all">Tous les niveaux d'intérêt</option>
          <option value="high">Élevé</option>
          <option value="medium">Moyen</option>
          <option value="low">Faible</option>
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
            Contact
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Intérêt
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Statut
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" on:click={sortByDate}>
            Suivi
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
        {#if filteredProspects.length === 0}
          <tr>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400" colspan="7">
              Aucun prospect trouvé. Essayez d'ajuster votre recherche ou vos filtres.
            </td>
          </tr>
        {:else}
          {#each filteredProspects as prospect}
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{prospect.name}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{prospect.company_name || '-'}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{prospect.business_category}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">{prospect.contact_email || '-'}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{prospect.contact_phone || '-'}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getProspectInterestColorClass(prospect.interest_level)}">
                  {getInterestLevelName(prospect.interest_level)}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {getProspectStatusColorClass(prospect.status)}">
                  {getProspectStatusName(prospect.status)}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {prospect.next_follow_up_date ? formatDate(prospect.next_follow_up_date) : '-'}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex space-x-2 justify-end">
                  <a 
                    href={`/prospects/${prospect.id}`} 
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    <span class="sr-only">Voir</span>
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </a>
                  <a 
                    href={`/prospects/${prospect.id}/edit`} 
                    class="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300"
                  >
                    <span class="sr-only">Modifier</span>
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </a>
                  <button 
                    type="button" 
                    class="text-error hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    on:click={() => deleteProspect(prospect.id)}
                  >
                    <span class="sr-only">Supprimer</span>
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