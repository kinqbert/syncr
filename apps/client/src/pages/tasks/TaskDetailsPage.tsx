import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Link as MuiLink,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  type Task,
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
  TaskPriority,
  TaskStatus,
  type UpdateTaskBody,
} from "@syncr/packages";
import { useState } from "react";
import { Link, useParams } from "react-router";

import { useGetProjectAssignees } from "@/api/projects";
import {
  taskKeys,
  useGetProjectTasks,
  useSetTaskAssignee,
  useUpdateTask,
} from "@/api/tasks";
import { queryClient } from "@/lib/react-query";
import { getErrorMessage } from "@/utils/getErrorMessage";

import { EditableText } from "./components/EditableText";
import { Panel } from "./components/Panel";

const toDateInputValue = (value: string | null) => {
  return value ? value.slice(0, 10) : "";
};

const updateTaskInCache = (projectId: number, updatedTask: Task) => {
  queryClient.setQueryData<Task[]>(
    taskKeys.projectTasks(projectId),
    (tasks = []) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
  );
};

const getUserInitials = (name: string, surname: string) => {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
};

const getUserName = (name: string, surname: string) => {
  return `${name} ${surname}`.trim();
};

export const TaskDetailsPage = () => {
  const { projectId, taskId } = useParams();
  const numericProjectId = Number(projectId);
  const numericTaskId = Number(taskId);
  const { data: tasks = [], isPending } = useGetProjectTasks(
    numericProjectId,
    Boolean(projectId),
  );
  const { data: projectAssignees = [], isPending: areAssigneesPending } =
    useGetProjectAssignees(numericProjectId, Boolean(projectId));
  const updateTask = useUpdateTask();
  const setTaskAssignee = useSetTaskAssignee();
  const [error, setError] = useState<string | null>(null);
  const task = tasks.find((item) => item.id === numericTaskId);
  const assignee = projectAssignees.find((user) => user.id === task?.assignee?.id);

  const saveTask = async (body: UpdateTaskBody) => {
    if (!task) {
      return;
    }

    setError(null);

    try {
      const updatedTask = await updateTask.mutateAsync({
        projectId: numericProjectId,
        taskId: task.id,
        body,
      });

      updateTaskInCache(numericProjectId, updatedTask);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Could not update task."));
    }
  };

  const saveAssignee = async (assigneeId: number | null) => {
    if (!task || (task.assignee?.id ?? null) === assigneeId) {
      return;
    }

    setError(null);

    try {
      const updatedTask = await setTaskAssignee.mutateAsync({
        projectId: numericProjectId,
        taskId: task.id,
        body: { assigneeId },
      });

      updateTaskInCache(numericProjectId, updatedTask);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Could not update task assignee."));
    }
  };

  if (!projectId || !taskId) {
    return null;
  }

  if (isPending) {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="100%">
        <CircularProgress />
      </Stack>
    );
  }

  if (!task) {
    return (
      <Stack gap={2} p={3}>
        <MuiLink component={Link} to={`/projects/${projectId}/tasks`}>
          Back to Task Board
        </MuiLink>
        <Typography variant="h5">Task could not be found</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      gap={3}
      p={3}
      sx={{
        bgcolor: "background.default",
        minHeight: "100%",
        overflow: "auto",
      }}
    >
      <MuiLink
        component={Link}
        to={`/projects/${projectId}/tasks`}
        underline="none"
        sx={{ alignItems: "center", display: "inline-flex", gap: 0.75 }}
      >
        <ArrowBackIcon fontSize="small" />
        Back to Task Board
      </MuiLink>

      <Box
        sx={{
          alignItems: "flex-start",
          display: "grid",
          gap: 2.25,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1fr) 420px",
          },
        }}
      >
        <Stack gap={2.25} minWidth={0}>
          <Panel>
            <Stack gap={2}>
              <Stack
                alignItems="flex-start"
                direction="row"
                gap={2}
                justifyContent="space-between"
              >
                <EditableText
                  onSave={(name) => {
                    if (!name) {
                      throw new Error("Title is required.");
                    }

                    return saveTask({ name });
                  }}
                  value={task.name}
                  variant="h5"
                />
                <Chip
                  color="primary"
                  label={TASK_STATUS_LABEL[task.status]}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
              <EditableText
                minRows={3}
                multiline
                onSave={(description) =>
                  saveTask({ description: description || null })
                }
                placeholder="Click to add a description"
                value={task.description ?? ""}
              />
              <Divider />
              <Stack gap={1}>
                <Typography variant="caption">Acceptance Criteria</Typography>
                {[
                  "Define the expected outcome",
                  "Update any affected UI states",
                  "Verify the change on the task board",
                  "Confirm permissions still behave correctly",
                ].map((item) => (
                  <Stack alignItems="center" direction="row" gap={1} key={item}>
                    <Box component="input" sx={{ m: 0 }} type="checkbox" />
                    <Typography variant="body2">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Panel>

          <Panel>
            <Stack gap={2}>
              <Typography variant="subtitle1">Attachments</Typography>
              {["API_Documentation.pdf", "Payment_Flow_Diagram.png"].map(
                (attachment) => (
                  <Stack
                    alignItems="center"
                    direction="row"
                    gap={1}
                    key={attachment}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      px: 1,
                      py: 1,
                    }}
                  >
                    <AttachFileIcon color="action" fontSize="small" />
                    <Typography sx={{ flex: 1 }} variant="body2">
                      {attachment}
                    </Typography>
                    <Button size="small">Download</Button>
                  </Stack>
                ),
              )}
              <Button fullWidth size="small" variant="outlined">
                Add Attachment
              </Button>
            </Stack>
          </Panel>

          <Panel>
            <Stack gap={2}>
              <Stack alignItems="center" direction="row" gap={1}>
                <ChatBubbleOutlineIcon fontSize="small" />
                <Typography variant="subtitle1">Comments</Typography>
              </Stack>
              {[
                "This looks great! Let's make sure we test all edge cases.",
                "I've completed the initial implementation. Ready for review.",
                "Do we need to update the documentation for this change?",
              ].map((comment, index) => (
                <Stack
                  alignItems="flex-start"
                  direction="row"
                  gap={1.25}
                  key={comment}
                >
                  <Avatar sx={{ height: 24, width: 24 }}>
                    {["SC", "MJ", "ED"][index]}
                  </Avatar>
                  <Stack>
                    <Typography variant="caption">
                      {["Sarah Chen", "Mike Johnson", "Emily Davis"][index]}
                    </Typography>
                    <Typography variant="body2">{comment}</Typography>
                  </Stack>
                </Stack>
              ))}
              <Divider />
              <Stack direction="row" gap={1.25}>
                <Avatar sx={{ height: 28, width: 28 }}>JD</Avatar>
                <TextField
                  fullWidth
                  minRows={2}
                  multiline
                  placeholder="Add a comment..."
                  size="small"
                />
              </Stack>
              <Button sx={{ alignSelf: "flex-end" }} variant="contained">
                Post Comment
              </Button>
            </Stack>
          </Panel>
        </Stack>

        <Stack gap={2.25} minWidth={0}>
          <Panel>
            <Stack gap={2}>
              <Typography variant="subtitle1">Details</Typography>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Stack gap={1}>
                <Typography color="text.secondary" variant="caption">
                  Assigned To
                </Typography>
                <TextField
                  disabled={areAssigneesPending || setTaskAssignee.isPending}
                  helperText={
                    projectAssignees.length === 0
                      ? "No users are assigned to this project."
                      : undefined
                  }
                  onChange={(event) =>
                    void saveAssignee(
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  select
                  size="small"
                  value={task.assignee?.id ?? ""}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {task.assignee && !assignee ? (
                    <MenuItem disabled value={task.assignee.id}>
                      {getUserName(task.assignee.name, task.assignee.surname)}
                    </MenuItem>
                  ) : null}
                  {projectAssignees.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Stack alignItems="center" direction="row" gap={1.25}>
                        <Avatar sx={{ height: 28, width: 28 }}>
                          {getUserInitials(user.name, user.surname)}
                        </Avatar>
                        <Stack minWidth={0}>
                          <Typography variant="body2">
                            {getUserName(user.name, user.surname)}
                          </Typography>
                          <Typography color="text.secondary" variant="caption">
                            {user.email}
                          </Typography>
                        </Stack>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <TextField
                label="Priority"
                onChange={(event) =>
                  void saveTask({
                    priority: event.target.value as TaskPriority,
                  })
                }
                select
                size="small"
                value={task.priority}
              >
                {(Object.values(TaskPriority) as TaskPriority[]).map(
                  (priority) => (
                    <MenuItem key={priority} value={priority}>
                      {TASK_PRIORITY_LABEL[priority]}
                    </MenuItem>
                  ),
                )}
              </TextField>

              <TextField
                label="Deadline"
                onChange={(event) =>
                  void saveTask({ endDate: event.target.value || null })
                }
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
                type="date"
                value={toDateInputValue(task.endDate)}
              />

              <TextField
                label="Status"
                onChange={(event) =>
                  void saveTask({ status: event.target.value as TaskStatus })
                }
                select
                size="small"
                value={task.status}
              >
                {(Object.values(TaskStatus) as TaskStatus[]).map((status) => (
                  <MenuItem key={status} value={status}>
                    {TASK_STATUS_LABEL[status]}
                  </MenuItem>
                ))}
              </TextField>

              <Stack gap={1}>
                <Typography color="text.secondary" variant="caption">
                  Labels
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <Chip label="Backend" size="small" />
                  <Chip label="API" size="small" />
                  <Button size="small" variant="outlined">
                    + Add Label
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Panel>

          <Panel>
            <Stack gap={2}>
              <Typography variant="subtitle1">Activity</Typography>
              {[
                "Task details opened",
                "Description ready for edits",
                "Task created",
              ].map((activity) => (
                <Stack direction="row" gap={1.25} key={activity}>
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                      height: 6,
                      mt: 0.75,
                      width: 6,
                    }}
                  />
                  <Stack>
                    <Typography variant="body2">{activity}</Typography>
                    <Typography color="text.secondary" variant="caption">
                      Recently
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Panel>
        </Stack>
      </Box>
    </Stack>
  );
};
