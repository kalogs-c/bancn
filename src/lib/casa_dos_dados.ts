import type { CNAE_NaturezaJuridica, CNPJ, FormattedCNPJ, RequestPayload, ResponseData } from "./api_types";

const API_BASE_URL = "https://api.casadosdados.com.br/v4/public/cnpj";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
  "Accept": "application/json",
  "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Referer": "https://casadosdados.com.br/",
  "Origin": "https://casadosdados.com.br",
  "Connection": "keep-alive",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-site",
  "TE": "trailers"
}

const SEARCH_URL = "https://api.casadosdados.com.br/v2/public/cnpj/search"

export async function listCNAE(): Promise<CNAE_NaturezaJuridica[]> {
  const cnaeList = fetch(API_BASE_URL + "/busca/cnae", { headers: DEFAULT_HEADERS })
    .then(response => response.json())
    .catch(error => error);

  return cnaeList;
}

export async function listNaturezaJuridica(): Promise<CNAE_NaturezaJuridica[]> {
  const naturezaJuridicaList = fetch(API_BASE_URL + "/busca/natureza-juridica", { headers: DEFAULT_HEADERS })
    .then(response => response.json())
    .catch(error => error);

  return naturezaJuridicaList;
}

export function formatCNPJ(cnpj: CNPJ): FormattedCNPJ {
  return {
    CNPJ: cnpj.cnpj,
    "CNPJ Raíz": cnpj.cnpj_raiz,
    "Matriz ou filial": cnpj.filial_numero == 1 ? "MATRIZ" : "FILIAL",
    "Razão Social": cnpj.razao_social,
    "Nome Fantasia": cnpj.nome_fantasia,
    "Data de abertura": cnpj.data_abertura.split("T")[0].split("-").reverse().join("/"),
    "Situacao cadastral": cnpj.situacao_cadastral,
    "Logradouro": cnpj.logradouro,
    "Número": cnpj.numero == "SN" ? "" : cnpj.numero,
    "Bairro": cnpj.bairro,
    "Município": cnpj.municipio,
    "UF": cnpj.uf,
    "Atividade Principal": cnpj.atividade_principal.codigo + " - " + cnpj.atividade_principal.descricao,
    "CNPJ MEI?": cnpj.cnpj_mei ? "SIM" : "NÃO",
  }
}

export async function listCNPJ(payload: RequestPayload): Promise<ResponseData> {
  const cnpjList: ResponseData = await fetch(SEARCH_URL, { headers: DEFAULT_HEADERS, body: JSON.stringify(payload), method: "POST" })
    .then(response => response.json())
    .catch(error => error);

  if (cnpjList.data.count == 0) {
    cnpjList.data.cnpj = [];
  }

  return cnpjList;
}
