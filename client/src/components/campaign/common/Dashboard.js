import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useCampaign } from "../../contexts/CampaignContext";
// import { useAuth } from "../../contexts/AuthContext";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Fab,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCampaign } from "../../../contexts/CampaignContext";
import { useAuth } from "../../../contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    campaigns,
    loading,
    getCampaigns,
    addCampaign,
    removeCampaign,
  } = useCampaign();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    getCampaigns();
  }, [getCampaigns]);

  const handleCreateCampaign = async () => {
    try {
      const newCampaign = {
        name: "New Campaign",
        description: "Describe your campaign",
        nodes: [],
        edges: [],
      };

      const campaign = await addCampaign(newCampaign);
      navigate(`/campaign/${campaign._id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const handleDeleteClick = (campaign) => {
    setCampaignToDelete(campaign);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (campaignToDelete) {
      try {
        await removeCampaign(campaignToDelete._id);
        setOpenDeleteDialog(false);
        setCampaignToDelete(null);
        setDeleteSuccess(true);

        // Refresh the campaign list after deletion
        getCampaigns();
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setCampaignToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setDeleteSuccess(false);
  };

  if (loading) return <div>Loading campaigns...</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Welcome, {user?.name}
        </Typography>
        <Button variant="contained" onClick={handleCreateCampaign}>
          New Campaign
        </Button>
      </Box>

      <Typography variant="h6" component="h2" gutterBottom>
        Your Campaigns
      </Typography>

      {campaigns.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="body1" gutterBottom>
            You don't have any campaigns yet.
          </Typography>
          <Button variant="contained" onClick={handleCreateCampaign}>
            Create Your First Campaign
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {campaigns.map((campaign) => (
            <Grid item key={campaign._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: 6 },
                  position: "relative",
                }}
                onClick={() => navigate(`/campaign/${campaign._id}`)}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {campaign.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {campaign.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(campaign.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(campaign);
                  }}
                  color="error"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={handleCreateCampaign}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Campaign</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the campaign "
            {campaignToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={deleteSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Campaign deleted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;