import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import TopBar from "../components/TopBar";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import api from "../api";

const LIMIT = 5;

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async (page = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      setError("");

      const { data } = await api.get(`/posts?page=${page}&limit=${LIMIT}`);

      setPosts((current) => (append ? [...current, ...data.posts] : data.posts));
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load the feed.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const addPost = (post) => {
    setPosts((current) => [post, ...current]);
  };

  const updatePost = (updatedPost) => {
    setPosts((current) =>
      current.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  return (
    <>
      <TopBar />

        <main
          className="feed-shell"
          style={{
            width: "100%",
            maxWidth: "440px",
            height: "calc(100vh - 56px)",
            margin: "0 auto",
            padding: "0 10px 80px",
            boxSizing: "border-box",
            overflowY: "auto",
            overflowX: "hidden",
            scrollbarWidth: "thin",
            scrollbarColor: "#cfcfcf transparent",
          }}
        >

        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4">Social Feed</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            See what the community is sharing.
          </Typography>
        </Box>

        <CreatePost onCreated={addPost} />

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => fetchPosts()}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack alignItems="center" sx={{ py: 8 }}>
            <CircularProgress />
          </Stack>
        ) : posts.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              bgcolor: "background.paper",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" fontWeight={800}>
              No posts yet
            </Typography>
            <Typography color="text.secondary">
              Be the first person to share something.
            </Typography>
          </Box>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdated={updatePost}
              />
            ))}

            {pagination.hasMore && (
              <Stack alignItems="center" sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => fetchPosts(pagination.page + 1, true)}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load more"}
                </Button>
              </Stack>
            )}
          </>
        )}
      </main>
    </>
  );
}
