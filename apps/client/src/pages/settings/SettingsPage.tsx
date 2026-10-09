import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import { Page, PageHeader } from "@/components/ui";

import {
  AppearanceSettingsSection,
  CalendarSettingsSection,
  CompanyWorkHoursSettingsSection,
  PasswordSettingsSection,
  ProfileSettingsSection,
} from "./components";

const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "appearance", label: "Appearance" },
  { id: "work-hours", label: "Work hours" },
  { id: "password", label: "Password" },
  { id: "calendar", label: "Calendar" },
];

/** Highlights the section currently in view. */
const useActiveSection = () => {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);

        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px" },
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);

      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return activeId;
};

export const SettingsPage = () => {
  const activeId = useActiveSection();

  return (
    <Page maxWidth={1080}>
      <PageHeader
        description="Manage your account and preferences."
        title="Settings"
      />

      <Box
        sx={{
          alignItems: "start",
          display: "grid",
          gap: 4,
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "180px minmax(0, 1fr)" },
        }}
      >
        <Stack
          component="nav"
          aria-label="Settings sections"
          gap={0.25}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "sticky",
            top: 24,
          }}
        >
          {SECTIONS.map((section) => (
            <Box
              component="a"
              href={`#${section.id}`}
              key={section.id}
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                document
                  .getElementById(section.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              sx={{
                bgcolor: activeId === section.id ? "surface.active" : "transparent",
                borderRadius: 1,
                color: activeId === section.id ? "text.primary" : "text.secondary",
                fontSize: 13,
                fontWeight: 500,
                px: 1,
                py: 0.75,
                "&:hover": { bgcolor: "surface.hover", color: "text.primary" },
              }}
            >
              {section.label}
            </Box>
          ))}
        </Stack>

        <Stack gap={2} minWidth={0}>
          <ProfileSettingsSection />
          <AppearanceSettingsSection />
          <CompanyWorkHoursSettingsSection />
          <PasswordSettingsSection />
          <CalendarSettingsSection />
        </Stack>
      </Box>
    </Page>
  );
};
