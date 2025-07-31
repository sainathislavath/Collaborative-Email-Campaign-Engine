import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Email Campaign Builder
        </Typography>

        {isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {user?.name || "User"}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                backgroundColor: "red", // Change this color as needed
                color: "#fff", // Ensure text is visible
                "&:hover": {
                  backgroundColor: "#d32f2f", // Optional: a darker shade on hover
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;