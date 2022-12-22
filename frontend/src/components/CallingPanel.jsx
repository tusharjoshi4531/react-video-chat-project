import { Paper, Stack, TextField, Button } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CallingPanel = ({
  name,
  idToCall,
  onNameInputChange,
  onIdToCallInputChange,
  me,
  callerName,
  showEndCall,
  showAnswer,
  onEndCall,
  onAnswer,
  onCall,
}) => {
  return (
    <Paper style={{ width: "500px", margin: "20px auto" }}>
      <Stack padding={4} spacing={4}>
        <TextField
          variant="filled"
          label="name"
          value={name}
          onChange={onNameInputChange}
        />
        <TextField
          variant="filled"
          label="Id to Call"
          value={idToCall}
          onChange={onIdToCallInputChange}
        />
        <CopyToClipboard text={me}>
          <Button variant="contained" size="large">
            Copy ID
          </Button>
        </CopyToClipboard>
        {showEndCall ? (
          <Button variant="contained" onClick={onEndCall}>
            End Call
          </Button>
        ) : (
          <Button variant="contained" onClick={onCall}>
            Call user
          </Button>
        )}
        {showAnswer && (
          <>
            <h1>{callerName} is calling</h1>
            <Button variant="contained" onClick={onAnswer}>
              Answer
            </Button>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default CallingPanel;
