<script lang="ts">
  import {
    getClientStatusName,
    getProspectStatusName,
    getClientStatusColorClass,
    getProspectStatusColorClass,
  } from "$lib/utils/statusUtils";

  // Props
  export let status: string;
  export let type: "client" | "prospect" = "client";

  // ステータス表示とスタイルを計算
  $: displayText =
    type === "client"
      ? getClientStatusName(status)
      : getProspectStatusName(status);

  $: colorClass =
    type === "client"
      ? getClientStatusColorClass(status)
      : getProspectStatusColorClass(status);
</script>

<span
  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full {colorClass}"
>
  {displayText}
</span>
