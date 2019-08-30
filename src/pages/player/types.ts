export interface Link {
  url: string,
  label: string,
  status: TAB_LOADING_STATUS
}

export enum TAB_LOADING_STATUS {
  LOADING = "LOADING",
  READY = "READY",
  LOAD_FAILED = "LOAD_FAILED"
}