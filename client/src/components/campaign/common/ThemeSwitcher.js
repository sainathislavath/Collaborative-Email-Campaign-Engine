import React from "react";
import { useTheme } from "@mui/material/styles";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeSwitcher = ({ darkMode, setDarkMode }) => {
  const theme = useTheme();

  return (
    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        color="inherit"
        onClick={() => setDarkMode(!darkMode)}
        sx={{ position: "fixed", bottom: 16, left: 16 }}
      >
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSwitcher;
