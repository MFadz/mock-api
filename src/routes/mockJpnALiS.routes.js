import express from "express";
import mockJpnALiSController from "../controllers/mockJpnALiS.controller.js";

const router = express.Router();

/**
 * JPN ALiS – Mock Endpoint
 * Used by ISM for DEV / SIT testing
 */
router.post("/jpn-ALiS/check", mockJpnALiSController.mockJpnALiSCheck);

export default router;
