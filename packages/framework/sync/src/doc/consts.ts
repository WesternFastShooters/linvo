export enum DocEngineStep {
  Stopped = 0,
  Synced = 2,
  Syncing = 1,
}

export enum DocPeerStep {
  LoadingRootDoc = 2,
  LoadingSubDoc = 3,
  Loaded = 3,
  Retrying = 1,
  Stopped = 0,
  Syncing = 4,
  Synced = 5,
}
