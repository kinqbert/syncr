import { useEffect, useRef, useState } from "react";

const HIGHLIGHT_DURATION_MS = 2500;

// pass undefined while loading so the first loaded list isn't treated as new
export const useRecentlyAddedIds = (ids: number[] | undefined) => {
  const seenIdsRef = useRef<Set<number> | null>(null);
  const [recentIds, setRecentIds] = useState<ReadonlySet<number>>(new Set());
  const idsKey = ids?.join(",");

  useEffect(() => {
    if (idsKey === undefined) {
      return;
    }

    const currentIds = idsKey ? idsKey.split(",").map(Number) : [];

    if (!seenIdsRef.current) {
      seenIdsRef.current = new Set(currentIds);
      return;
    }

    const seenIds = seenIdsRef.current;
    const addedIds = currentIds.filter((id) => !seenIds.has(id));

    if (addedIds.length === 0) {
      return;
    }

    addedIds.forEach((id) => seenIds.add(id));
    setRecentIds(new Set(addedIds));

    const timeout = window.setTimeout(
      () => setRecentIds(new Set()),
      HIGHLIGHT_DURATION_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [idsKey]);

  return recentIds;
};
