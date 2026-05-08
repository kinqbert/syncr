import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  Calendar,
  FolderKanban,
  MessageCircle,
  SquareCheckBig,
  Users,
} from "lucide-mui";
import { Link } from "react-router";

import { useMe } from "@/api";
import { useAuthStore } from "@/store/useAuthStore";

const features = [
  {
    title: "Shared project clarity",
    description:
      "Organize every workspace around projects, members, tasks, ownership, and the next decision your team needs to make.",
    icon: FolderKanban,
  },
  {
    title: "Focused task flow",
    description:
      "Move work through a visual board, keep acceptance criteria close, and make priorities visible without extra ceremony.",
    icon: SquareCheckBig,
  },
  {
    title: "Team context in one place",
    description:
      "See who is involved, what they are working on, and where collaboration needs a quick nudge.",
    icon: Users,
  },
  {
    title: "Updates that stay useful",
    description:
      "Notifications, comments, and recent activity help everyone catch up without digging through scattered channels.",
    icon: MessageCircle,
  },
];

const boardColumns = [
  {
    label: "Backlog",
    count: 4,
    color: "#2563EB",
    tasks: ["Shape onboarding copy", "Invite design review"],
  },
  {
    label: "In progress",
    count: 3,
    color: "#EA580C",
    tasks: ["Build project board", "Tune team permissions"],
  },
  {
    label: "Done",
    count: 7,
    color: "#10B981",
    tasks: ["Launch comment thread", "Sync notification badges"],
  },
];

const principles = [
  "Know what matters today",
  "Keep work tied to people",
  "Turn updates into momentum",
];

const workflowSteps = [
  {
    step: "01",
    title: "Start with the project",
    description:
      "Create a shared space for the work, add the right people, and keep every task connected to the larger goal.",
  },
  {
    step: "02",
    title: "Move tasks with intent",
    description:
      "Use the board to make progress visible, clarify ownership, and spot the work that needs attention next.",
  },
  {
    step: "03",
    title: "Keep decisions close",
    description:
      "Comments, acceptance criteria, and activity give teammates the context they need without another status meeting.",
  },
];

export const AboutPage = () => {
  const storedUser = useAuthStore((state) => state.user);
  const { data: currentUser } = useMe();
  const isAuthorized = Boolean(storedUser || currentUser);
  const loginTarget = isAuthorized ? "/" : "/login";
  const registerTarget = isAuthorized ? "/" : "/register";

  return (
    <Box
      component="main"
      sx={{
        background:
          "linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 48%, #F8FAFC 100%)",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ mb: { xs: 5, md: 7 } }}
        >
          <Stack alignItems="center" direction="row" gap={1.25}>
            <Box
              sx={{
                alignItems: "center",
                bgcolor: "primary.main",
                borderRadius: 2,
                color: "primary.contrastText",
                display: "flex",
                height: 36,
                justifyContent: "center",
                width: 36,
              }}
            >
              <FolderKanban sx={{ fontSize: 19 }} />
            </Box>
            <Typography fontWeight={800} variant="h6">
              Syncr
            </Typography>
          </Stack>

          <Stack direction="row" gap={1}>
            <Button component={Link} to={loginTarget} variant="text">
              Log in
            </Button>
            <Button component={Link} to={registerTarget} variant="contained">
              Get started
            </Button>
          </Stack>
        </Stack>

        <Grid
          container
          alignItems="center"
          columnSpacing={{ xs: 0, md: 7 }}
          rowSpacing={5}
          sx={{ minHeight: { md: "calc(100vh - 170px)" } }}
        >
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack gap={3.25}>
              <Stack gap={2}>
                <Chip
                  label="Team project management"
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: "#EEF2FF",
                    color: "primary.dark",
                    fontWeight: 700,
                  }}
                />
                <Typography
                  component="h1"
                  sx={{
                    color: "text.primary",
                    fontSize: { xs: 44, sm: 58, md: 68 },
                    fontWeight: 800,
                    letterSpacing: 0,
                    lineHeight: 0.98,
                  }}
                >
                  Work stays clear when the whole team can see it.
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: { xs: 17, md: 18 }, lineHeight: 1.65 }}
                >
                  Syncr brings projects, task boards, team membership, comments,
                  and notifications into one calm workspace for teams that want
                  less chasing and more progress.
                </Typography>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
                <Button
                  component={Link}
                  endIcon={<ArrowRight />}
                  size="large"
                  to={registerTarget}
                  variant="contained"
                >
                  Start planning
                </Button>
                <Button
                  component={Link}
                  size="large"
                  to={loginTarget}
                  variant="outlined"
                >
                  I already have an account
                </Button>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                divider={<Divider flexItem orientation="vertical" />}
                gap={{ xs: 1.5, sm: 2.5 }}
                sx={{ color: "text.secondary" }}
              >
                {principles.map((principle) => (
                  <Typography key={principle} fontSize={14} fontWeight={700}>
                    {principle}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                boxShadow: "0 24px 70px rgba(17, 24, 39, 0.14)",
                overflow: "hidden",
              }}
            >
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                sx={{ bgcolor: "#111827", color: "#FFFFFF", px: 2.5, py: 2 }}
              >
                <Stack gap={0.5}>
                  <Typography fontSize={14} fontWeight={800}>
                    Product launch
                  </Typography>
                  <Typography color="#CBD5E1" fontSize={12}>
                    14 active tasks across 6 teammates
                  </Typography>
                </Stack>
                <Chip
                  icon={<Calendar />}
                  label="This week"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.12)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    ".MuiChip-icon": { color: "#FFFFFF" },
                  }}
                />
              </Stack>

              <Grid
                container
                spacing={1.5}
                sx={{ bgcolor: "#F8FAFC", p: { xs: 1.5, sm: 2 } }}
              >
                {boardColumns.map((column) => (
                  <Grid key={column.label} size={{ xs: 12, sm: 4 }}>
                    <Stack
                      gap={1.25}
                      sx={{
                        bgcolor: "#FFFFFF",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        minHeight: 245,
                        p: 1.5,
                      }}
                    >
                      <Stack
                        alignItems="center"
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography fontSize={13} fontWeight={800}>
                          {column.label}
                        </Typography>
                        <Chip
                          label={column.count}
                          size="small"
                          sx={{
                            bgcolor: `${column.color}14`,
                            color: column.color,
                            fontWeight: 800,
                            height: 24,
                            minWidth: 32,
                          }}
                        />
                      </Stack>

                      {column.tasks.map((task, index) => (
                        <Paper
                          key={task}
                          elevation={0}
                          sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1.5,
                            p: 1.5,
                          }}
                        >
                          <Stack gap={1.25}>
                            <Typography fontSize={13} fontWeight={700}>
                              {task}
                            </Typography>
                            <Stack
                              alignItems="center"
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Box
                                sx={{
                                  bgcolor: index === 0 ? "#EEF2FF" : "#ECFDF5",
                                  borderRadius: 999,
                                  height: 8,
                                  width: index === 0 ? "68%" : "46%",
                                }}
                              />
                              <Typography color="text.secondary" fontSize={11}>
                                {index === 0 ? "Today" : "Fri"}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box
        component="section"
        sx={{ bgcolor: "#FFFFFF", py: { xs: 7, md: 9 } }}
      >
        <Container maxWidth="lg">
          <Stack gap={4}>
            <Stack gap={1.5} maxWidth={680}>
              <Typography component="h2" fontSize={34} fontWeight={800}>
                Built for the daily rhythm of product work.
              </Typography>
              <Typography color="text.secondary" fontSize={17} lineHeight={1.7}>
                From a fresh project to the tiny details inside a task, Syncr
                keeps the conversation attached to the work so teams can move
                without losing the thread.
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                        height: "100%",
                        p: 2.5,
                      }}
                    >
                      <Stack gap={2}>
                        <Box
                          sx={{
                            alignItems: "center",
                            bgcolor: "#EEF2FF",
                            borderRadius: 2,
                            color: "primary.main",
                            display: "flex",
                            height: 42,
                            justifyContent: "center",
                            width: 42,
                          }}
                        >
                          <Icon />
                        </Box>
                        <Stack gap={1}>
                          <Typography fontSize={17} fontWeight={800}>
                            {feature.title}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            fontSize={14}
                            lineHeight={1.65}
                          >
                            {feature.description}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 7, md: 9 } }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={{ xs: 4, md: 6 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack gap={2}>
                <Typography component="h2" fontSize={34} fontWeight={800}>
                  A calmer way to move from plan to shipped.
                </Typography>
                <Typography
                  color="text.secondary"
                  fontSize={17}
                  lineHeight={1.7}
                >
                  Syncr is built around the practical rhythm of small teams:
                  plan the work, move it forward, and leave enough context for
                  the next person to keep going.
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Stack gap={1.5}>
                {workflowSteps.map((item) => (
                  <Paper
                    key={item.step}
                    elevation={0}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                      p: { xs: 2, sm: 2.5 },
                    }}
                  >
                    <Stack
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      direction={{ xs: "column", sm: "row" }}
                      gap={2}
                    >
                      <Box
                        sx={{
                          alignItems: "center",
                          bgcolor: "#111827",
                          borderRadius: 2,
                          color: "#FFFFFF",
                          display: "flex",
                          flexShrink: 0,
                          fontSize: 13,
                          fontWeight: 800,
                          height: 44,
                          justifyContent: "center",
                          width: 52,
                        }}
                      >
                        {item.step}
                      </Box>
                      <Stack gap={0.75}>
                        <Typography fontSize={18} fontWeight={800}>
                          {item.title}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          fontSize={14}
                          lineHeight={1.65}
                        >
                          {item.description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        component="section"
        sx={{ bgcolor: "#FFFFFF", py: { xs: 7, md: 9 } }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#111827",
              borderRadius: 3,
              color: "#FFFFFF",
              overflow: "hidden",
              p: { xs: 3, sm: 4, md: 5 },
            }}
          >
            <Grid container alignItems="center" spacing={4}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack gap={1.5}>
                  <Typography component="h2" fontSize={34} fontWeight={800}>
                    Bring the whole workspace into focus.
                  </Typography>
                  <Typography color="#CBD5E1" fontSize={17} lineHeight={1.7}>
                    Start with one project, invite your team, and give everyone
                    a cleaner place to understand what is moving, what is
                    blocked, and what changed since they last checked in.
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Stack
                  alignItems={{
                    xs: "stretch",
                    sm: "flex-start",
                    md: "flex-end",
                  }}
                  gap={1.5}
                >
                  <Button
                    component={Link}
                    endIcon={<ArrowRight />}
                    size="large"
                    to={registerTarget}
                    variant="contained"
                  >
                    Create your workspace
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "#FFFFFF",
          borderTop: 1,
          borderColor: "divider",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            alignItems={{ xs: "flex-start", sm: "center" }}
            direction={{ xs: "column", sm: "row" }}
            gap={2}
            justifyContent="space-between"
          >
            <Stack gap={0.5}>
              <Typography fontSize={15} fontWeight={800}>
                Syncr
              </Typography>
              <Typography color="text.secondary" fontSize={13}>
                Clear project work for focused teams.
              </Typography>
            </Stack>

            <Stack direction="row" gap={2.5}>
              <Typography
                color="text.secondary"
                component={Link}
                fontSize={13}
                fontWeight={700}
                to={loginTarget}
              >
                Log in
              </Typography>
              <Typography
                color="text.secondary"
                component={Link}
                fontSize={13}
                fontWeight={700}
                to={registerTarget}
              >
                Get started
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
