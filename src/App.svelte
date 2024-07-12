<script lang="ts">
  import { onMount } from "svelte";
  import type { CNAE_NaturezaJuridica, ResponseData } from "./lib/api_types";
  import {
    listCNAE,
    listCNPJ,
    listNaturezaJuridica,
    formatCNPJ,
  } from "./lib/casa_dos_dados";
  import CompleteInput from "./lib/components/complete_input.svelte";
  import Estados from "./lib/UF.json";

  let isModalOpen = false;

  let CNAE: CNAE_NaturezaJuridica[] = [];
  let NaturezaJuridica: CNAE_NaturezaJuridica[] = [];

  let CNPJsFullResult: ResponseData | undefined = undefined;
  let CNPJs: Record<string, string>[] | undefined = undefined;

  onMount(async () => {
    [CNAE, NaturezaJuridica] = await Promise.all([
      listCNAE(),
      listNaturezaJuridica(),
    ]);
  });

  const search = async () => {
    const result: ResponseData = await listCNPJ({
      page: 1,
      extras: {
        com_contato_telefonico: false,
        com_email: false,
        excluir_mei: false,
        incluir_atividade_secundaria: false,
        somente_celular: false,
        somente_filial: false,
        somente_fixo: false,
        somente_matriz: false,
        somente_mei: false,
      },
      query: {
        atividade_principal: ["4721102"],
        bairro: [],
        cep: [],
        ddd: [],
        municipio: [],
        natureza_juridica: [],
        situacao_cadastral: "ATIVA",
        termo: [],
        uf: [],
      },
      range_query: {
        capital_social: { lte: null, gte: null },
        data_abertura: { lte: null, gte: null },
      },
    });

    CNPJsFullResult = result;
    CNPJs = result.data.cnpj.map(formatCNPJ);
  };
</script>

<main class="h-full">
  <div
    class="flex h-full max-w-full flex-col justify-center items-center gap-5"
  >
    <div class="flex gap-5">
      <CompleteInput
        values={CNAE}
        displayFunction={(cnae) => cnae.code + " - " + cnae.name}
        placeholder="CNAE"
        label="Atividade Principal (CNAE)"
      />
      <CompleteInput
        values={NaturezaJuridica}
        displayFunction={(nj) => nj.code + " - " + nj.name}
        placeholder="Natureza Jurídica"
        label="Natureza Jurídica"
      />
    </div>
    <div class="flex gap-5">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text"><strong>Situação Cadastral</strong></span>
        </div>
        <select class="select select-bordered">
          <option selected>ATIVA</option>
          <option>BAIXADA</option>
          <option>INAPTA</option>
          <option>SUSPENSA</option>
          <option>NULA</option>
        </select>
      </label>
      <CompleteInput
        values={Estados.UF}
        displayFunction={(e) => e.nome}
        placeholder="Estado"
        label="Estado (UF)"
      />
    </div>
    <button
      class="btn btn-primary modal-button w-fit"
      on:click={() => {
        isModalOpen = true;
        search();
      }}
      >Pesquisar
    </button>
  </div>

  <div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box max-w-full">
      {#if CNPJs}
        <div class="flex w-full h-full justify-between items-center mb-5">
          <div>
            <span
              ><strong>{CNPJsFullResult?.data.count}</strong> Resultados</span
            >
          </div>
          <div class="flex gap-5">
            <button class="btn btn-ghost">Copiar página para o clipboard</button
            >
            <button class="btn btn-primary">Salvar tudo como CSV</button>
            <button
              on:click={() => (isModalOpen = false)}
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
                {#each Object.values(cnpj) as formatedCNPJ}
                  <td>{formatedCNPJ}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <div class="flex justify-center items-center h-full flex-row gap-5">
          <span class="loading loading-infinity loading-lg"></span>
        </div>
      {/if}
    </div>
  </div>
</main>
