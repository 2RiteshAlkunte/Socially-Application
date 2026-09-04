import { useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function CreatePost({ onCreated }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async () => {
    if (!text.trim() && !file) {
      setError("Add some text or choose an image.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("text", text);

      if (file) {
        formData.append("image", file);
      }

      const { data } = await api.post("/posts", formData);

      onCreated(data.post);
      setText("");
      clearImage();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      {submitting && <LinearProgress />}
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Share something with the community
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              inputProps={{ maxLength: 2000 }}
            />

            {preview && (
              <Box sx={{ position: "relative", mt: 1.5 }}>
                <Box
                  component="img"
                  src={preview}
                  alt="Selected preview"
                  sx={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
                <IconButton
                  aria-label="Remove image"
                  onClick={clearImage}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "background.paper",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}

            {error && <Alert severity="error" sx={{ mt: 1.5 }}>{error}</Alert>}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={1}
              sx={{ mt: 1.5 }}
            >
              <Button
                variant="text"
                startIcon={<ImageIcon />}
                onClick={() => fileInputRef.current?.click()}
              >
                Add image
              </Button>

              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
              />

              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={submit}
                disabled={submitting || (!text.trim() && !file)}
              >
                Post
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
