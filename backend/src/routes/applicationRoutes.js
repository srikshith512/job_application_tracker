import express from "express";
import {
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  getApplicationStats,
  updateApplication
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getApplications).post(createApplication);
router.get("/stats", getApplicationStats);
router.route("/:id").get(getApplicationById).put(updateApplication).delete(deleteApplication);

export default router;
