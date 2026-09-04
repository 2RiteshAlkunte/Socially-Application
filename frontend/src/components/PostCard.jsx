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
    pt: 1,
    pb: 1,
  }}
>
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
  >
    {/* LIKE */}
    <Button
      onClick={handleLike}
      disabled={likeLoading}
      sx={{
        minWidth: 0,
        p: 0,
        color: liked ? "#ff2da1" : "#666",
        textTransform: "none",
        fontSize: "13px",
        fontWeight: 500,
        justifyContent: "flex-start",
        gap: 0.5,
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      {liked ? (
        <FavoriteIcon
          sx={{
            fontSize: 21,
            color: "#ff2da1",
          }}
        />
      ) : (
        <FavoriteBorderIcon
          sx={{
            fontSize: 21,
            color: "#777",
          }}
        />
      )}

      <span>{post.likes.length}</span>
    </Button>

    {/* COMMENTS */}
    <Button
      onClick={() =>
        setShowComments((value) => !value)
      }
      sx={{
        minWidth: 0,
        p: 0,
        color: "#666",
        textTransform: "none",
        fontSize: "13px",
        fontWeight: 500,
        gap: 0.5,
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <CommentIcon
        sx={{
          fontSize: 20,
          color: "#1976d2",
        }}
      />

      <span>{post.comments.length}</span>
    </Button>

    {/* SHARE */}
    <Button
      sx={{
        minWidth: 0,
        p: 0,
        color: "#666",
        textTransform: "none",
        fontSize: "13px",
        fontWeight: 500,
        gap: 0.5,
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <ShareIcon
        sx={{
          fontSize: 20,
          color: "#777",
        }}
      />

      <span>0</span>
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
    <Box
      sx={{
        mt: 1.5,
        pt: 1.5,
        borderTop: "1px solid #eee",
      }}
    >
      {/* COMMENT INPUT */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
      >
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
              borderRadius: "22px",
              backgroundColor: "#f1f3f6",
              fontSize: "13px",

              "& fieldset": {
                border: "none",
              },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleComment}
          disabled={
            !commentText.trim() ||
            submittingComment
          }
          sx={{
            minWidth: "66px",
            height: "40px",
            borderRadius: "20px",
            textTransform: "none",
            backgroundColor: "#1976d2",

            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Send
        </Button>
      </Stack>

      {/* COMMENTS LIST */}
      <Stack
        spacing={1.5}
        sx={{
          mt: 2,
        }}
      >
        {[...post.comments]
          .reverse()
          .map((comment) => (
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-start"
              key={
                comment._id ||
                `${comment.userId}-${comment.createdAt}`
              }
            >
              {/* COMMENT AVATAR */}
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  bgcolor: "#f5a623",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {comment.username
                  .charAt(0)
                  .toUpperCase()}
              </Avatar>

              {/* COMMENT CONTENT */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {/* NAME + USERNAME */}
                <Stack
                  direction="row"
                  alignItems="baseline"
                  spacing={0.75}
                  sx={{
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#222",
                    }}
                  >
                    {comment.username}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#777",
                    }}
                  >
                    @{comment.username}
                  </Typography>
                </Stack>

                {/* DATE */}
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#999",
                    lineHeight: 1.3,
                    mt: 0.1,
                  }}
                >
                  {formatDate(comment.createdAt)}
                </Typography>

                {/* COMMENT TEXT */}
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "#333",
                    lineHeight: 1.5,
                    mt: 0.4,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
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