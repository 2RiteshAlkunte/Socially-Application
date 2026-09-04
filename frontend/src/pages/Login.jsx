import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-background">
      <Card sx={{ width: "100%", maxWidth: 430 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2.5} component="form" onSubmit={submit}>
            <Box sx={{ textAlign: "center" }}>
              <LockOutlinedIcon color="primary" sx={{ fontSize: 42 }} />
              <Typography variant="h4" sx={{ mt: 1 }}>
                Welcome back
              </Typography>
              <Typography color="text.secondary">
                Log in to join the conversation.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>

            <Typography textAlign="center" color="text.secondary">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/signup" underline="hover" fontWeight={700}>
                Sign up
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
