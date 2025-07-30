import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Tooltip,
  Box,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

const CampaignHeader = ({ campaign, onSave, isDirty, collaborators }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <IconButton edge="start" onClick={() => navigate("/")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {campaign?.name || "Campaign Builder"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={`Collaborators: ${collaborators.length}`}>
            <Badge
              badgeContent={collaborators.length}
              color="primary"
              sx={{ mr: 2 }}
            >
              <PeopleIcon />
            </Badge>
          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={!isDirty}
          >
            Save
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CampaignHeader;
