// src/components/common/ThemeSwitcher.js
import React from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeMode } from "../../../contexts/ThemeContext";
// import { useThemeMode } from "../contexts/ThemeContext";

const ThemeSwitcher = () => {
  const { darkMode, setDarkMode } = useThemeMode();
  const theme = useMuiTheme();

  return (
    <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        color="inherit"
        onClick={() => setDarkMode((prevMode) => !prevMode)}
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
