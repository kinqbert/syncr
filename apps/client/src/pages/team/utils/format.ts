export const normalizeWorkload = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
};

export const formatPercent = (value: number) =>
  `${Math.round(normalizeWorkload(value) * 100)}%`;
