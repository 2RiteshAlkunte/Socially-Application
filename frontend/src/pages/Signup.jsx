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
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create account.");
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
              <PersonAddAltIcon color="primary" sx={{ fontSize: 42 }} />
              <Typography variant="h4" sx={{ mt: 1 }}>
                Create account
              </Typography>
              <Typography color="text.secondary">
                Start sharing with the community.
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Username"
              value={form.username}
              onChange={update("username")}
              required
              fullWidth
              inputProps={{ minLength: 2, maxLength: 30 }}
            />

            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={update("email")}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={update("password")}
              required
              fullWidth
              helperText="Minimum 6 characters"
              inputProps={{ minLength: 6 }}
            />

            <TextField
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <Typography textAlign="center" color="text.secondary">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" underline="hover" fontWeight={700}>
                Log in
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
