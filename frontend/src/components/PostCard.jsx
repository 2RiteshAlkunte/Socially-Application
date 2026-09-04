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
    () => post.likes?.some((like) => like.userId === user.id || like.userId?._id === user.id),
    [post.likes, user.id]
  );

  const handleLike = async () => {
    if (likeLoading) return;

    setLikeLoading(true);
    setError("");

    const previous = post;

    const nextLikes = liked
      ? post.likes.filter((like) => (like.userId?._id || like.userId) !== user.id)
      : [...post.likes, { userId: user.id, username: user.username }];

    onUpdated({
      ...post,
      likes: nextLikes,
    });

    try {
      const { data } = await api.post(`/posts/${post._id}/like`);

      onUpdated({
        ...post,
        likes: data.likes,
      });
    } catch (err) {
      onUpdated(previous);
      setError(err.response?.data?.message || "Unable to update like.");
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
      const { data } = await api.post(`/posts/${post._id}/comments`, { text });

      onUpdated({
        ...post,
        comments: [...post.comments, data.comment],
      });

      setCommentText("");
      setShowComments(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <Card sx={{ mb: 2.5, overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar>{post.author.username.charAt(0).toUpperCase()}</Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800}>{post.author.username}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
          </Box>
        </Stack>

        {post.text && (
          <Typography sx={{ mt: 2, whiteSpace: "pre-wrap", lineHeight: 1.65 }}>
            {post.text}
          </Typography>
        )}
      </CardContent>

      {post.imageUrl && (
        <Box
          component="img"
          className="post-image"
          src={post.imageUrl}
          alt={`Post by ${post.author.username}`}
          loading="lazy"
        />
      )}

      <CardContent sx={{ pt: 1.25, pb: 1.5 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
          </Typography>
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Stack direction="row" justifyContent="space-between">
          <Button
            onClick={handleLike}
            disabled={likeLoading}
            startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            sx={{ color: liked ? "error.main" : "text.secondary", flex: 1 }}
          >
            Like
          </Button>

          <Button
            onClick={() => setShowComments((value) => !value)}
            startIcon={<CommentIcon />}
            sx={{ color: "text.secondary", flex: 1 }}
          >
            Comment
          </Button>
        </Stack>

        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

        {showComments && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
                inputProps={{ maxLength: 500 }}
              />
              <IconButton
                color="primary"
                onClick={handleComment}
                disabled={!commentText.trim() || submittingComment}
              >
                <SendIcon />
              </IconButton>
            </Stack>

            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {[...post.comments].reverse().map((comment) => (
                <Box key={comment._id || `${comment.userId}-${comment.createdAt}`}>
                  <Stack direction="row" spacing={1}>
                    <Avatar sx={{ width: 30, height: 30, fontSize: 13 }}>
                      {comment.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box
                      sx={{
                        bgcolor: "grey.100",
                        borderRadius: 2,
                        px: 1.5,
                        py: 1,
                        flex: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={800}>
                        {comment.username}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                        {comment.text}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
