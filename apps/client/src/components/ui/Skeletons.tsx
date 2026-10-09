import { Skeleton, Stack } from "@mui/material";

import { Page } from "./Page";

export const RowSkeleton = ({ count = 5 }: { count?: number }) => (
  <Stack aria-busy gap={0.5}>
    {Array.from({ length: count }, (_, index) => (
      <Stack alignItems="center" direction="row" gap={1.25} key={index} py={0.75}>
        <Skeleton height={24} variant="circular" width={24} />
        <Stack flex={1} gap={0.5}>
          <Skeleton height={14} variant="rounded" width={`${60 - (index % 3) * 12}%`} />
          <Skeleton height={10} variant="rounded" width="30%" />
        </Stack>
      </Stack>
    ))}
  </Stack>
);

/** Generic loading state: header, stat strip and two content blocks. */
export const PageSkeleton = () => (
  <Page>
    <Stack aria-busy aria-label="Loading" gap={2.5}>
      <Stack gap={0.75}>
        <Skeleton height={26} variant="rounded" width={240} />
        <Skeleton height={14} variant="rounded" width={360} />
      </Stack>
      <Skeleton height={84} variant="rounded" />
      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        <Skeleton height={280} sx={{ flex: 2 }} variant="rounded" />
        <Skeleton height={280} sx={{ flex: 1 }} variant="rounded" />
      </Stack>
    </Stack>
  </Page>
);
