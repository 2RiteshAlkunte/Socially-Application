import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  const menuOpen = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
        zIndex: 1100,
      }}
    >
        <Toolbar
          sx={{
            minHeight: "56px !important",
            width: "100%",
            maxWidth: "460px",
            mx: "auto",
            px: 1,
          }}
        >
        {/* LEFT SIDE */}
          <Typography
            sx={{
              flex: 1,
              fontSize: "20px",
              fontWeight: 700,
              color: "#111",
            }}
          >
            Social
          </Typography>

        {/* RIGHT SIDE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.7, sm: 1 },
          }}
        >
          {/* POINTS */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              height: 32,
              px: 1.4,
              borderRadius: "18px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 800,
                color: "#f44336",
              }}
            >
              50
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
              }}
            >
              ⭐
            </Typography>
          </Box>

          {/* MONEY */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              px: 1.4,
              borderRadius: "18px",
              backgroundColor: "#edf8ed",
              border: "1px solid #c5e5c5",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#168a2c",
              }}
            >
              ₹0.00
            </Typography>
          </Box>

          {/* PROFILE AVATAR */}
          <IconButton
            onClick={handleAvatarClick}
            sx={{
              p: "3px",
              ml: 0.3,
              border: "2px solid #ddd",
              borderRadius: "50%",
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "#f5a623",
                color: "#fff",
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>

          {/* DROPDOWN */}
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 170,
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.15)",
                },
              },
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                gap: 1.2,
                px: 2,
                py: 1.2,
                fontSize: "14px",
                color: "#333",
              }}
            >
              <LogoutIcon
                sx={{
                  fontSize: 19,
                  color: "#555",
                }}
              />

              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}