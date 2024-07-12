import type { CNAE_NaturezaJuridica, RequestPayload, ResponseData } from "./api_types";

const API_BASE_URL = "https://api.casadosdados.com.br/v4/public/cnpj";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json"
}

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

export async function listCNPJ(payload: RequestPayload): Promise<ResponseData> {
  const cnpjList = fetch(API_BASE_URL + "/search", { headers: DEFAULT_HEADERS, body: JSON.stringify(payload) })
    .then(response => response.json())
    .catch(error => error);

  return cnpjList;
}
