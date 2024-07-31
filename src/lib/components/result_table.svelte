<script lang="ts">
  import type { ResponseData, FormattedCNPJ } from "../api_types";
  import { formatCNPJ } from "../casa_dos_dados";
  import { CNPJsResultStore } from "./table_store";

  export let onExitFunction: (
    e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) => void;

  let currentResult: ResponseData | undefined;
  let CNPJs: FormattedCNPJ[] = [];

  CNPJsResultStore.subscribe((value) => {
    currentResult = value;
    CNPJs = value?.data.cnpj.map(formatCNPJ) ?? [];
  });
</script>

{#if currentResult}
  <div class="flex w-full h-full justify-between items-center mb-5">
    <div>
      <span><strong>{currentResult?.data.count}</strong> Resultados</span>
    </div>
    <div class="flex gap-5">
      <button class="btn btn-ghost">Copiar página para o clipboard</button>
      <button class="btn btn-primary">Salvar tudo como CSV</button>
      <button
        on:click={onExitFunction}
        class="btn btn-circle btn-ghost right-2 top-2 !font-5xl">✕</button
      >
    </div>
  </div>
  <table class="table table-xs">
    <thead>
      <tr>
        {#each Object.keys(CNPJs[0]) as header}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>

    <tbody>
      {#each CNPJs as cnpj}
        <tr class="hover p-2">
          {#each Object.values(cnpj) as values}
            <td>{values}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
