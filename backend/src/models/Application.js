import mongoose from "mongoose";

export const APPLICATION_STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];
export const APPLICATION_PRIORITIES = ["Low", "Medium", "High"];

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true
    },
    location: {
      type: String,
      trim: true,
      default: "Remote"
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      default: "Full-time"
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "Saved",
      index: true
    },
    priority: {
      type: String,
      enum: APPLICATION_PRIORITIES,
      default: "Medium"
    },
    salaryRange: {
      type: String,
      trim: true,
      default: ""
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    deadline: Date,
    source: {
      type: String,
      trim: true,
      default: ""
    },
    contactName: {
      type: String,
      trim: true,
      default: ""
    },
    contactEmail: {
      type: String,
      trim: true,
      default: ""
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
    nextAction: {
      type: String,
      trim: true,
      default: ""
    },
    nextActionDate: Date,
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

applicationSchema.index({ user: 1, status: 1, appliedDate: -1 });
applicationSchema.index({ company: "text", position: "text", location: "text", notes: "text" });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
