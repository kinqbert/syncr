import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Button, Stack, Typography } from "@mui/material";

import { Panel } from "../../../components/Panel";

const attachments = ["API_Documentation.pdf", "Payment_Flow_Diagram.png"];

export const TaskAttachmentsPanel = () => {
  return (
    <Panel>
      <Stack gap={2}>
        <Typography variant="subtitle1">Attachments</Typography>
        {attachments.map((attachment) => (
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
        ))}
        <Button fullWidth size="small" variant="outlined">
          Add Attachment
        </Button>
      </Stack>
    </Panel>
  );
};
