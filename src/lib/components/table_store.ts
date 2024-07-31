import { writable, type Writable } from "svelte/store";
import type { ResponseData } from "../api_types";

export const CNPJsResultStore: Writable<ResponseData> = writable();
