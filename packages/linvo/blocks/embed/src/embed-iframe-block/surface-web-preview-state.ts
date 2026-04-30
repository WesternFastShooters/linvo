import { signal } from '@preact/signals-core';

type LeaseEntry = {
  id: string;
  priority: number;
  updatedAt: number;
};

const leaseVersion$ = signal(0);
const activeLeases = new Map<string, LeaseEntry>();

function bumpVersion() {
  leaseVersion$.value += 1;
}

export function getSurfaceWebPreviewLeaseVersion() {
  return leaseVersion$.value;
}

export function releaseSurfaceWebPreviewLease(id: string) {
  if (!activeLeases.delete(id)) {
    return;
  }

  bumpVersion();
}

export function requestSurfaceWebPreviewLease(
  id: string,
  priority: number,
  maxActive: number
) {
  const existing = activeLeases.get(id);
  const now = Date.now();

  if (existing) {
    if (existing.priority !== priority) {
      activeLeases.set(id, { ...existing, priority, updatedAt: now });
      bumpVersion();
    }
    return true;
  }

  if (maxActive <= 0) {
    return false;
  }

  if (activeLeases.size < maxActive) {
    activeLeases.set(id, { id, priority, updatedAt: now });
    bumpVersion();
    return true;
  }

  let candidate: LeaseEntry | null = null;
  for (const entry of activeLeases.values()) {
    if (
      !candidate ||
      entry.priority < candidate.priority ||
      (entry.priority === candidate.priority &&
        entry.updatedAt < candidate.updatedAt)
    ) {
      candidate = entry;
    }
  }

  if (!candidate || candidate.priority >= priority) {
    return false;
  }

  activeLeases.delete(candidate.id);
  activeLeases.set(id, { id, priority, updatedAt: now });
  bumpVersion();
  return true;
}

export function resetSurfaceWebPreviewLeasesForTest() {
  activeLeases.clear();
  bumpVersion();
}
