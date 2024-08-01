<script lang="ts">
  import { onMount } from "svelte";
  import type {
    CNAE_NaturezaJuridica,
    Municipio,
    ResponseData,
    SituacaoCadastral,
  } from "./lib/api_types";
  import {
    listCNAE,
    listCNPJ,
    listNaturezaJuridica,
    listMunicipios,
  } from "./lib/casa_dos_dados";
  import CompleteInput from "./lib/components/complete_input.svelte";
  import Estados from "./lib/UF.json";
  import ResultTable from "./lib/components/result_table.svelte";
  import { CNPJsResultStore } from "./lib/components/table_store";
  import {
    CNAEsWritable,
    NJsWritable,
    UFsWritable,
    DDDsWritable,
    MunicipiosWritable,
  } from "./lib/components/form_store";

  let isModalOpen = false;

  let CNAE: CNAE_NaturezaJuridica[] = [];
  let NaturezaJuridica: CNAE_NaturezaJuridica[] = [];
  let Municipios: Municipio[] = [];

  onMount(async () => {
    [CNAE, NaturezaJuridica] = await Promise.all([
      listCNAE(),
      listNaturezaJuridica(),
    ]);
  });

  let atividade_principal: string[] = [];
  CNAEsWritable.subscribe((cnae) => (atividade_principal = cnae));

  let natureza_juridica: string[] = [];
  NJsWritable.subscribe((nj) => (natureza_juridica = nj));

  let municipiosSelected: string[] = [];
  MunicipiosWritable.subscribe((m) => (municipiosSelected = m));

  let ufs: string[] = [];
  UFsWritable.subscribe(async (uf) => {
    // Adicionar pq tem mais selecionados
    if (uf.length > ufs.length) {
      Municipios = [
        ...Municipios,
        ...(await listMunicipios(uf[uf.length - 1])),
      ];
    } else if (uf.length < ufs.length) {
      // Remover pq tem menos selecionados
      const differentUf = ufs.filter((u) => !uf.includes(u)).pop();
      const toRemove = Municipios.filter((m) => m.uf == differentUf).map(
        (m) => m.name,
      );

      if (toRemove.length > 0) {
        Municipios = Municipios.filter((m) => m.uf != differentUf);

        MunicipiosWritable.set(
          municipiosSelected.filter((m) => !toRemove.includes(m)),
        );
      }
    }

    ufs = uf;
  });

  let ddds: string[] = [];
  DDDsWritable.subscribe((ddd) => (ddds = ddd));

  let situacao_cadastral: SituacaoCadastral;

  const search = async (page: number) => {
    const result: ResponseData = await listCNPJ({
      page,
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
        atividade_principal,
        bairro: [],
        cep: [],
        ddd: ddds,
        municipio: municipiosSelected,
        natureza_juridica,
        situacao_cadastral,
        termo: [],
        uf: ufs,
      },
      range_query: {
        capital_social: { lte: null, gte: null },
        data_abertura: { lte: null, gte: null },
      },
    });

    CNPJsResultStore.set(result);
  };
</script>

<main class="h-full">
  <form
    on:submit|preventDefault={() => {}}
    class="flex h-full max-w-full flex-col justify-center items-center gap-5"
  >
    <div class="flex gap-5">
      <CompleteInput
        selectedStore={CNAEsWritable}
        values={CNAE}
        displayFunction={(cnae) => cnae.code + " - " + cnae.name}
        selectedFieldFunction={(cnae) => cnae.code}
        placeholder="CNAE"
        label="Atividade Principal (CNAE)"
      />
      <CompleteInput
        selectedStore={NJsWritable}
        values={NaturezaJuridica}
        displayFunction={(nj) => nj.code + " - " + nj.name}
        selectedFieldFunction={(nj) => nj.code}
        placeholder="Natureza Jurídica"
        label="Natureza Jurídica"
      />
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text"><strong>Situação Cadastral</strong></span>
        </div>
        <select bind:value={situacao_cadastral} class="select select-bordered">
          <option selected>ATIVA</option>
          <option>BAIXADA</option>
          <option>INAPTA</option>
          <option>SUSPENSA</option>
          <option>NULA</option>
        </select>
      </label>
    </div>
    <div class="flex gap-5">
      <CompleteInput
        selectedStore={DDDsWritable}
        values={Estados.UF.map((uf) => uf.ddd)
          .flat()
          .sort()}
        displayFunction={(ddd) => ddd.toString()}
        selectedFieldFunction={(ddd) => ddd.toString()}
        placeholder="DDD"
        label="DDD"
        width="w-20"
      />
      <CompleteInput
        selectedStore={UFsWritable}
        values={Estados.UF}
        displayFunction={(e) => e.nome}
        selectedFieldFunction={(uf) => uf.sigla}
        placeholder="Estado"
        label="Estado (UF)"
      />
      <CompleteInput
        selectedStore={MunicipiosWritable}
        values={Municipios}
        displayFunction={(m) => m.name}
        selectedFieldFunction={(m) => m.name}
        placeholder="Municipio"
        label="Municipio"
      />
      <CompleteInput
        selectedStore={MunicipiosWritable}
        values={["123", "456", "789"]}
        displayFunction={(m) => ""}
        selectedFieldFunction={(m) => m}
        placeholder="Municipio"
        label="Municipio"
      />
    </div>
    <button
      class="btn btn-primary modal-button w-fit"
      on:click={() => {
        isModalOpen = true;
        search(1);
      }}
      >Pesquisar
    </button>
  </form>

  <div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box max-w-full">
      <ResultTable onExitFunction={() => (isModalOpen = false)} />
    </div>
  </div>
</main>
