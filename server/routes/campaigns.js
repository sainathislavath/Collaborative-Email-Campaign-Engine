const express = require("express");
const Campaign = require("../models/Campaign");
const auth = require("../middleware/auth");
const router = express.Router();

// Get all campaigns
router.get("/", auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id });
    res.json(campaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get campaign by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Check if user owns the campaign
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create campaign
router.post("/", auth, async (req, res) => {
  const { name, description, nodes, edges } = req.body;

  try {
    const newCampaign = new Campaign({
      name,
      description,
      nodes: nodes || [],
      edges: edges || [],
      createdBy: req.user.id,
    });

    const campaign = await newCampaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update campaign
router.put("/:id", auth, async (req, res) => {
  const { name, description, nodes, edges } = req.body;

  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Check if user owns the campaign
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description, nodes, edges, updatedAt: Date.now() } },
      { new: true }
    );

    res.json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete campaign
router.delete("/:id", auth, async (req, res) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Check if user owns the campaign
    if (campaign.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Campaign.findByIdAndRemove(req.params.id);
    res.json({ message: "Campaign removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
