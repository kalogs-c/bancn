type Extras = {
  com_contato_telefonico: boolean;
  com_email: boolean;
  excluir_mei: boolean;
  incluir_atividade_secundaria: boolean;
  somente_celular: boolean;
  somente_filial: boolean;
  somente_fixo: boolean;
  somente_matriz: boolean;
  somente_mei: boolean;
};

type SituacaoCadastral =
  | "ATIVA"
  | "BAIXADA"
  | "INAPTA"
  | "SUSPENSA"
  | "NULA";

type Query = {
  atividade_principal: string[];
  bairro: string[];
  cep: string[];
  ddd: string[];
  municipio: string[];
  natureza_juridica: string[];
  situacao_cadastral: SituacaoCadastral;
  termo: string[];
  uf: string[];
};

type Range = {
  lte: string | null;
  gte: string | null;
}

type RangeQuery = {
  capital_social: Range;
  data_abertura: Range;
};

export type RequestPayload = {
  extras: Extras;
  query: Query;
  range_query: RangeQuery;
  page: number;
}

export type UF = {
  nome: string;
  sigla: string;
}

export type Municipio = {
  uf: UF["sigla"];
  name: string;
};

export type CNAE_NaturezaJuridica = {
  name: string;
  code: string;
}

export type CNPJ = {
  cnpj: string;
  cnpj_raiz: string;
  filial_numero: number,
  razao_social: string;
  nome_fantasia: string;
  data_abertura: string;
  situacao_cadastral: SituacaoCadastral;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: UF;
  atividade_principal: {
    codigo: string;
    descricao: string;
  },
  cnpj_mei: boolean;
  versao: string;
};

export type ResponseData = {
  success: boolean;
  data: {
    count: number;
    cnpj: CNPJ[];
  }
  page: {
    current: number;
  }
}
