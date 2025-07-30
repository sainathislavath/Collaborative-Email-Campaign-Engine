import React, { useEffect } from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCampaign } from "../../../contexts/CampaignContext";
import { useAuth } from "../../../contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { campaigns, loading, getCampaigns, addCampaign } = useCampaign();

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
    </Container>
  );
};

export default Dashboard;
