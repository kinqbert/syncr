import { CircleAlert } from "lucide-mui";

import { getErrorMessage } from "@/utils/getErrorMessage";

import { EmptyState, Page, Section } from "./ui";

type ErrorStateProps = {
  error: unknown;
  fallback?: string;
  title?: string;
};

export const ErrorState = ({
  error,
  fallback = "Something went wrong.",
  title = "Could not load data.",
}: ErrorStateProps) => (
  <Page>
    <Section>
      <EmptyState
        description={getErrorMessage(error, fallback)}
        icon={<CircleAlert />}
        title={title}
      />
    </Section>
  </Page>
);
