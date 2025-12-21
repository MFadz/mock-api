import express from "express";
import mockPaymentController from "#controllers/mockPayment.controller";

const router = express.Router();

// POST /v1/mock/payment
router.post("/mockPayment/test", mockPaymentController.mockCreatePayment);
router.post("/mockPayment/PaymentReceivables", mockPaymentController.PaymentReceivables);
router.post("/mockPayment/CheckBudget", mockPaymentController.CheckBudget);
// router.post("/mockPayment/ZakatDistribution", mockPaymentController.VoucherOneToOnePayTo);
router.post("/mockPayment/VoucherOneToOnePayTo", mockPaymentController.VoucherOneToOnePayTo);

router.post("/mockPayment/paymentOnce", mockPaymentController.mockPaymentOnce);

router.post("/mock/kerisi/zakat-distribution", mockPaymentController.mockKerisiZakatDistribution);

export default router;