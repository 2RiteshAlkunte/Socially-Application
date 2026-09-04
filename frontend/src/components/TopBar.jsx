import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ maxWidth: 1100, width: "100%", mx: "auto", px: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 900, color: "primary.main", flexGrow: 1 }}
        >
          Socially
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ width: 34, height: 34 }}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700 }}>
            {user.username}
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ ml: 0.5 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
