import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { configureDns } from "./config/dns.js";
import Application from "./models/Application.js";
import User from "./models/User.js";

dotenv.config();
configureDns();

const demoUser = {
  name: "Demo User",
  email: "demo@example.com",
  password: "password123"
};

const sampleApplications = [
  {
    company: "Vercel",
    position: "Frontend Engineer",
    location: "Remote",
    jobType: "Full-time",
    status: "Interviewing",
    priority: "High",
    salaryRange: "Competitive",
    source: "Company site",
    notes: "Prepare React performance examples and deployment experience.",
    nextAction: "Technical interview",
    tags: ["react", "frontend", "remote"]
  },
  {
    company: "Atlassian",
    position: "Software Engineer Intern",
    location: "Bengaluru",
    jobType: "Internship",
    status: "Applied",
    priority: "Medium",
    source: "LinkedIn",
    notes: "Application submitted with resume tailored for collaboration tools.",
    nextAction: "Follow up with recruiter",
    tags: ["internship", "javascript"]
  },
  {
    company: "MongoDB",
    position: "Developer Advocate",
    location: "Remote",
    jobType: "Full-time",
    status: "Saved",
    priority: "Low",
    source: "Referral",
    notes: "Needs portfolio links and sample technical writing.",
    nextAction: "Ask for referral details",
    tags: ["mongodb", "content", "community"]
  }
];

const seed = async () => {
  await connectDB();

  const existingDemo = await User.findOne({ email: demoUser.email });
  if (existingDemo) {
    await Application.deleteMany({ user: existingDemo._id });
    await User.deleteOne({ _id: existingDemo._id });
  }

  const user = await User.create(demoUser);
  const applications = sampleApplications.map((application) => ({
    ...application,
    user: user._id,
    appliedDate: new Date()
  }));

  await Application.insertMany(applications);

  console.log("Seeded demo account:");
  console.log(`Email: ${demoUser.email}`);
  console.log(`Password: ${demoUser.password}`);

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
