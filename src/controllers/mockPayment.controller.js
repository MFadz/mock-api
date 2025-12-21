import crypto from "crypto";
import axios from "axios";

const randomAlphabet = (length = 3) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  return result;
};

export const mockCreatePayment = (req, res) => {
  const src = req.body || {};

  // you can shape this however you like
  const response = {
    status: "SUCCESS",
    message: "Mock payment created",
    refNo: src.refNo || "MOCK-REF-001",
    amount: src.amount || 0,
    channel: src.channel || "MOCK",
    mockTimestamp: new Date().toISOString(),
  };

  // optional: simulate network / gateway delay
  const delay = Math.floor(Math.random() * 400) + 100; // 100–500ms

  setTimeout(() => {
    res.json(response);
  }, delay);
};

export const PaymentReceivables = (req, res) => {
  try {
    const payload = req.body || {};

    // Basic required fields (you can add more validation if needed)
    const {
      api_name,
      receipt_no,
      payment_date,
      total_amt_myr,
      cust_name,
      payment_mode,
      details,
    } = payload;

    if (!api_name || api_name !== "POST_RECEIPT") {
      return res.status(400).json({
        status: "ERROR",
        code: "KERISI-001",
        message: "Invalid or missing api_name. Expected POST_RECEIPT.",
      });
    }

    if (!receipt_no) {
      return res.status(400).json({
        status: "ERROR",
        code: "KERISI-002",
        message: "Missing receipt_no.",
      });
    }

    if (!total_amt_myr) {
      return res.status(400).json({
        status: "ERROR",
        code: "KERISI-003",
        message: "Missing total_amt_myr.",
      });
    }

    const financeReceiptNo =
      "KERISI-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    console.log("🔌 [Kerisi MOCK] POST_RECEIPT payload:", JSON.stringify(payload));

    const responseBody = {
      status: "Success",
      code: "200",
      message: `Data has successfully integrated with the customer receipt number: ${receipt_no}`,
      finance_receipt_no: financeReceiptNo
    };

    return res.status(200).json(responseBody);
  } catch (err) {
    console.error("❌ [Kerisi MOCK] Error handling POST_RECEIPT:", err);

    return res.status(500).json({
      status: "ERROR",
      code: "KERISI-500",
      message: "Internal server error (MOCK).",
    });
  }
};

export const CheckBudget = async (req, res) => {
  try {
    const { api_name, payable_item_code, total_amt_myr } = req.body || {};

    // Basic validation
    if (api_name !== "POST_CHECK_BUDGET") {
      return res.status(400).json({
        status: "Failed",
        code: "400",
        message: "Invalid api_name. Expected POST_CHECK_BUDGET"
      });
    }

    if (!payable_item_code) {
      return res.status(400).json({
        status: "Failed",
        code: "400",
        message: "Missing payable_item_code"
      });
    }

      const randomOne = Array.from(crypto.randomBytes(3)).map(b => (b % 10).toString()).join('');

      const randomTwo = Array.from(crypto.randomBytes(3)).map(b => (b % 10).toString()).join('');

    return res.json({
      status: "Success",
      code: "200",
      message: `Data has successfully checked with the customer payable item code: ${payable_item_code}. The budget is sufficient`,
      finance_structure_budget: "E01-" + randomOne + "-PPZ-" + randomTwo + "- B0912110"
    });
  } catch (err) {
    console.error("[mock-api] CheckBudget error:", err);
    return res.status(500).json({
      status: "Failed",
      code: "500",
      message: "Internal server error while checking budget"
    });
  }
};

export const VoucherOneToOnePayTo = async (req, res) => {
  try {
    const { api_name, voucher_no } = req.body || {};

    // Very light validation
    if (api_name !== "POST_VOUCHER") {
      return res.status(400).json({
        status: "Failed",
        code: "400",
        message: "Invalid api_name. Expected POST_VOUCHER",
      });
    }

    if (!voucher_no) {
      return res.status(400).json({
        status: "Failed",
        code: "400",
        message: "Missing voucher_no",
      });
    }

    const randomOne = Array.from(crypto.randomBytes(3)).map(b => (b % 10).toString()).join('');

    const prefix = randomAlphabet(3);

    // Fixed mock response (can change later if needed)
    return res.json({
      status: "Success",
      code: "200",
      message: `Data has successfully integrated with the customer voucher / invoice number: ${voucher_no}`,
      finance_voucher_no: `${prefix}${randomOne}/25`,
    });
  } catch (err) {
    console.error("[mock-api] VoucherOneToOnePayTo error:", err);
    return res.status(500).json({
      status: "Failed",
      code: "500",
      message: "Internal server error while processing voucher",
    });
  }
};

export const mockPaymentOnce = async (req, res) => {
  const start = Date.now();
  const src = req.body || {};

  console.log("💳 [MOCK-PG] payment-once hit:", src);

  try {
    const refnmber = src.refnmber || "TEST-REF-001";
    const amount = Number(src.amount) || 1;
    const channel = src.channel || "STRESS_SINGLE";
    const meta = src.meta || null;

    // Simulate latency (ms)
    const delayMs = Number(process.env.MOCK_PG_DELAY_MS || 100);
    if (delayMs > 0) {
      await new Promise((r) => setTimeout(r, delayMs));
    }

    // Simulate random failure
    const failRate = Number(process.env.MOCK_PG_FAIL_RATE || 0); // 0.1 = 10%
    const isFail = Math.random() < failRate;

    const transactionId =
      "MOCKTX-" +
      Date.now().toString(36) +
      "-" +
      crypto.randomBytes(3).toString("hex");

    const response = {
      provider: "MOCK_PG",
      status: isFail ? "FAILED" : "SUCCESS",
      code: isFail ? "99" : "00",
      message: isFail
        ? "Mock payment rejected"
        : "Mock payment approved",
      refnmber,
      amount,
      channel,
      meta,
      transactionId,
      processedAt: new Date().toISOString(),
      latencyMs: Date.now() - start,
    };

    console.log("✅ [MOCK-PG] response:", response);

    // Always HTTP 200 – business result in body
    return res.status(200).json(response);
  } catch (err) {
    console.error("❌ [MOCK-PG] error:", err);

    return res.status(500).json({
      provider: "MOCK_PG",
      status: "ERROR",
      code: "EX",
      message: "Mock payment error",
      error: err.message,
    });
  }
};

export const mockKerisiZakatDistribution = async (req, res) => {
  /**
   * Allow override HTTP status:
   * - via query: ?httpStatus=201
   * - or via body: { httpStatus: 201 }
   */
  const httpStatus =
    Number(req.query.httpStatus) ||
    Number(req.body?.httpStatus) ||
    200;

  const activityId =
    req.body?.voucher_no ||
    req.body?.details?.[0]?.invoice_no ||
    "MAIPS/A01/251221/A002";

  // --- Mock response body (MATCHES your Postman output) ---
  const responseBody = {
    status: "SUCCESS",
    message: "Forwarded to Kerisi successfully",
    activity_id: activityId,
    kerisi_http: httpStatus,
    data: {
      status: "Success",
      code: httpStatus,
      message: `Data has successfully integrated with the customer voucher / invoice number: ${activityId}`,
      finance_voucher_no: "VCZ021025/25",
    },
  };

  return res.status(httpStatus).json(responseBody);
};

export default { 
    mockCreatePayment,
    PaymentReceivables,
    CheckBudget,
    VoucherOneToOnePayTo,
    mockPaymentOnce,
    mockKerisiZakatDistribution
};