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
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";

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

  const [activeTab, setActiveTab] = useState("all");

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
    if (preview) {
      URL.revokeObjectURL(preview);
    }

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
      setError(
        err.response?.data?.message ||
          "Unable to create post."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 2.5,
        borderRadius: "14px",
        backgroundColor: "#fff",
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
      }}
    >
      {submitting && <LinearProgress />}

      <CardContent
        sx={{
          p: "12px !important",
        }}
      >
        {/* TOP SECTION */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 2,
          }}
        >
          {/* TITLE */}
          <Typography
            sx={{
              fontSize: "24px",
              lineHeight: 1.2,
              fontWeight: 400,
              color: "#222",
            }}
          >
            Create Post
          </Typography>

          {/* TABS */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f0f0f4",
              borderRadius: "24px",
              padding: "3px",
            }}
          >
            <Button
              onClick={() => setActiveTab("all")}
              sx={{
                minWidth: "76px",
                height: "36px",
                px: 1.5,
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "12px",
                fontWeight: 700,
                color:
                  activeTab === "all"
                    ? "#fff"
                    : "#555",
                backgroundColor:
                  activeTab === "all"
                    ? "#1976f3"
                    : "transparent",
                boxShadow:
                  activeTab === "all"
                    ? "0 3px 8px rgba(25,118,243,0.35)"
                    : "none",
                "&:hover": {
                  backgroundColor:
                    activeTab === "all"
                      ? "#1976f3"
                      : "transparent",
                },
              }}
            >
              All Posts
            </Button>

            <Button
              onClick={() => setActiveTab("promotions")}
              sx={{
                minWidth: "92px",
                height: "36px",
                px: 1.5,
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "12px",
                fontWeight: 500,
                color:
                  activeTab === "promotions"
                    ? "#fff"
                    : "#555",
                backgroundColor:
                  activeTab === "promotions"
                    ? "#1976f3"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    activeTab === "promotions"
                      ? "#1976f3"
                      : "transparent",
                },
              }}
            >
              Promotions
            </Button>
          </Box>
        </Stack>

        {/* TEXT INPUT */}
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={8}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          inputProps={{
            maxLength: 2000,
          }}
          variant="standard"
          sx={{
            mb: 1.5,

            "& .MuiInputBase-root": {
              fontSize: "13px",
              color: "#333",
              padding: 0,
            },

            "& .MuiInputBase-input": {
              padding: "8px 5px 12px",
            },

            "& .MuiInputBase-input::placeholder": {
              color: "#777",
              opacity: 1,
            },

            "& .MuiInput-underline:before": {
              borderBottom: "1px solid #e5e5e5",
            },

            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottom: "1px solid #bbb",
            },

            "& .MuiInput-underline:after": {
              borderBottomColor: "#1976f3",
            },
          }}
        />

        {/* IMAGE PREVIEW */}
        {preview && (
          <Box
            sx={{
              position: "relative",
              mt: 1,
              mb: 1.5,
            }}
          >
            <Box
              component="img"
              src={preview}
              alt="Selected preview"
              sx={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: "10px",
                display: "block",
              }}
            />

            <IconButton
              aria-label="Remove image"
              onClick={clearImage}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 30,
                height: 30,
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",

                "&:hover": {
                  backgroundColor: "#fff",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}

        {/* ERROR */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,
              fontSize: "12px",
            }}
          >
            {error}
          </Alert>
        )}

        {/* BOTTOM ACTION BAR */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* LEFT ACTIONS */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.2}
          >
            {/* IMAGE */}
            <IconButton
              onClick={() =>
                fileInputRef.current?.click()
              }
              sx={{
                color: "#087cff",
                width: 32,
                height: 32,
              }}
            >
              <ImageIcon sx={{ fontSize: 21 }} />
            </IconButton>

            {/* EMOJI */}
            <IconButton
              sx={{
                color: "#087cff",
                width: 32,
                height: 32,
              }}
            >
              <SentimentSatisfiedAltIcon
                sx={{ fontSize: 21 }}
              />
            </IconButton>

            {/* POLL / STATS */}
            <IconButton
              sx={{
                color: "#087cff",
                width: 32,
                height: 32,
              }}
            >
              <EqualizerIcon
                sx={{ fontSize: 21 }}
              />
            </IconButton>

            {/* SOUND */}
            <IconButton
              sx={{
                color: "#087cff",
                width: 32,
                height: 32,
              }}
            >
              <VolumeUpOutlinedIcon
                sx={{ fontSize: 21 }}
              />
            </IconButton>

            {/* PROMOTE */}
            <Button
              sx={{
                minWidth: 0,
                px: 0.5,
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 500,
                color: "#087cff",
              }}
            >
              Promote
            </Button>

            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
            />
          </Stack>

          {/* POST BUTTON */}
          <Button
            variant="contained"
            onClick={submit}
            disabled={
              submitting ||
              (!text.trim() && !file)
            }
            sx={{
              minWidth: "77px",
              height: "38px",
              borderRadius: "20px",
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 700,

              backgroundColor:
                text.trim() || file
                  ? "#1976f3"
                  : "#d0d0d0",

              color:
                text.trim() || file
                  ? "#fff"
                  : "#fff",

              boxShadow: "none",

              "&:hover": {
                backgroundColor:
                  text.trim() || file
                    ? "#1268d6"
                    : "#d0d0d0",
                boxShadow: "none",
              },

              "&.Mui-disabled": {
                backgroundColor: "#d0d0d0",
                color: "#fff",
              },
            }}
          >
            Post
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}