// src/components/campaign/CampaignHeader.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Tooltip,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const CampaignHeader = ({
  campaign,
  onSave,
  isDirty,
  collaborators,
  onCampaignChange,
}) => {
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState({
    name: campaign?.name || "",
    description: campaign?.description || "",
  });

  const handleEditClick = () => {
    setEditedCampaign({
      name: campaign.name,
      description: campaign.description,
    });
    setOpenEditDialog(true);
  };

  const handleSaveCampaign = () => {
    onCampaignChange({
      ...campaign,
      name: editedCampaign.name,
      description: editedCampaign.description,
    });
    setOpenEditDialog(false);
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate("/")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {campaign?.name || "Campaign Builder"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {campaign?.description || "No description"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Edit Campaign">
              <IconButton onClick={handleEditClick} sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
            </Tooltip>

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

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Campaign</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Campaign Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editedCampaign.name}
            onChange={(e) =>
              setEditedCampaign({ ...editedCampaign, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editedCampaign.description}
            onChange={(e) =>
              setEditedCampaign({
                ...editedCampaign,
                description: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveCampaign} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CampaignHeader;
