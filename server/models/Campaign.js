const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  nodes: [
    {
      id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["email", "wait", "condition", "action"],
        required: true,
      },
      position: {
        x: Number,
        y: Number,
      },
      data: {
        name: String,
        subject: String,
        template: String,
        duration: String,
        conditions: [
          {
            type: {
              type: String,
              enum: ["behavior", "time"],
            },
            event: {
              type: String,
              enum: ["open", "click", "purchase", "idle"],
            },
            timeValue: String,
          },
        ],
        actionType: String,
        actionValue: String,
      },
    },
  ],
  edges: [
    {
      id: String,
      source: String,
      target: String,
      sourceHandle: String,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
