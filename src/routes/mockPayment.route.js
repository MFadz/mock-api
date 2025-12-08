import express from "express";
import { mockCreatePayment } from "../controllers/mockPayment.controller.js";

const router = express.Router();

// POST /v1/mock/payment
router.post("/payment", mockCreatePayment);

export default router;