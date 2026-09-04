import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareIcon from "@mui/icons-material/Share";

import { useAuth } from "../context/AuthContext";
import api from "../api";

const formatDate = (value) => {
  const date = new Date(value);

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function PostCard({ post, onUpdated }) {
  const { user } = useAuth();

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [error, setError] = useState("");

  const liked = useMemo(
    () =>
      post.likes?.some(
        (like) =>
          like.userId === user.id ||
          like.userId?._id === user.id
      ),
    [post.likes, user.id]
  );

  const handleLike = async () => {
    if (likeLoading) return;

    setLikeLoading(true);
    setError("");

    const previous = post;

    const nextLikes = liked
      ? post.likes.filter(
          (like) =>
            (like.userId?._id || like.userId) !== user.id
        )
      : [
          ...post.likes,
          {
            userId: user.id,
            username: user.username,
          },
        ];

    onUpdated({
      ...post,
      likes: nextLikes,
    });

    try {
      const { data } = await api.post(
        `/posts/${post._id}/like`
      );

      onUpdated({
        ...post,
        likes: data.likes,
      });
    } catch (err) {
      onUpdated(previous);

      setError(
        err.response?.data?.message ||
          "Unable to update like."
      );
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async () => {
    const text = commentText.trim();

    if (!text || submittingComment) return;

    setSubmittingComment(true);
    setError("");

    try {
      const { data } = await api.post(
        `/posts/${post._id}/comments`,
        { text }
      );

      onUpdated({
        ...post,
        comments: [...post.comments, data.comment],
      });

      setCommentText("");
      setShowComments(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add comment."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: "14px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.16)",
        overflow: "hidden",
      }}
    >
      {/* POST HEADER */}
      <CardContent
        sx={{
          px: 2,
          pt: 1.75,
          pb: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ minWidth: 0 }}
          >
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#e6b325",
                color: "#000",
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              {post.author.username
                .charAt(0)
                .toUpperCase()}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "#222",
                  }}
                >
                  {post.author.username}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#777",
                  }}
                >
                  ·
                </Typography>

                <Button
                  size="small"
                  sx={{
                    minWidth: 0,
                    p: 0,
                    textTransform: "none",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#3a0ca3",
                  }}
                >
                  Follow
                </Button>
              </Stack>

              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#777",
                  mt: 0.1,
                }}
              >
                @{post.author.username}
              </Typography>

              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#999",
                  mt: 0.15,
                }}
              >
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Stack>

          <IconButton
            size="small"
            sx={{
              color: "#777",
              ml: 1,
            }}
          >
            <MoreHorizIcon />
          </IconButton>
        </Stack>
      </CardContent>

      {/* POST TEXT */}
      {post.text && (
        <CardContent
          sx={{
            pt: 0.75,
            pb: post.imageUrl ? 1.5 : 1,
            px: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#333",
              whiteSpace: "pre-wrap",
            }}
          >
            {post.text}
          </Typography>
        </CardContent>
      )}

      {/* POST IMAGE */}
      {post.imageUrl && (
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#f5f5f5",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={post.imageUrl}
            alt={`Post by ${post.author.username}`}
            loading="lazy"
            className="post-image"
            sx={{
              display: "block",
              width: "100%",
              maxHeight: "650px",
              objectFit: "contain",
            }}
          />
        </Box>
      )}

      {/* LIKE / COMMENT COUNTS */}
      <CardContent
        sx={{
          px: 2,
          pt: 1.25,
          pb: 0.75,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2}>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#777",
              }}
            >
              {post.likes.length}{" "}
              {post.likes.length === 1 ? "like" : "likes"}
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                color: "#777",
              }}
            >
              {post.comments.length}{" "}
              {post.comments.length === 1
                ? "comment"
                : "comments"}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mt: 1 }} />

        {/* ACTIONS */}
        <Stack
          direction="row"
          sx={{
            mt: 0.25,
          }}
        >
          <Button
            onClick={handleLike}
            disabled={likeLoading}
            startIcon={
              liked ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )
            }
            sx={{
              flex: 1,
              color: liked ? "#e53935" : "#666",
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              minHeight: 42,
              borderRadius: 2,
            }}
          >
            Like
          </Button>

          <Button
            onClick={() =>
              setShowComments((value) => !value)
            }
            startIcon={<CommentIcon />}
            sx={{
              flex: 1,
              color: "#666",
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              minHeight: 42,
              borderRadius: 2,
            }}
          >
            Comment
          </Button>

          <Button
            startIcon={<ShareIcon />}
            sx={{
              flex: 1,
              color: "#666",
              textTransform: "none",
              fontSize: "13px",
              fontWeight: 600,
              minHeight: 42,
              borderRadius: 2,
            }}
          >
            Share
          </Button>
        </Stack>

        {/* ERROR */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 1,
              fontSize: "12px",
            }}
          >
            {error}
          </Alert>
        )}

        {/* COMMENTS */}
        {showComments && (
          <Box sx={{ mt: 1.5 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
                inputProps={{
                  maxLength: 500,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    backgroundColor: "#f5f5f5",
                    fontSize: "13px",
                  },
                }}
              />

              <IconButton
                onClick={handleComment}
                disabled={
                  !commentText.trim() ||
                  submittingComment
                }
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#3a0ca3",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "#2d087f",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#ddd",
                    color: "#999",
                  },
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* COMMENT LIST */}
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {[...post.comments]
                .reverse()
                .map((comment) => (
                  <Stack
                    direction="row"
                    spacing={1}
                    key={
                      comment._id ||
                      `${comment.userId}-${comment.createdAt}`
                    }
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 12,
                        bgcolor: "#e6b325",
                        color: "#000",
                        fontWeight: 700,
                      }}
                    >
                      {comment.username
                        .charAt(0)
                        .toUpperCase()}
                    </Avatar>

                    <Box
                      sx={{
                        flex: 1,
                        backgroundColor: "#f3f3f3",
                        borderRadius: "12px",
                        px: 1.5,
                        py: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: "#333",
                        }}
                      >
                        {comment.username}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#444",
                          whiteSpace: "pre-wrap",
                          mt: 0.25,
                        }}
                      >
                        {comment.text}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}