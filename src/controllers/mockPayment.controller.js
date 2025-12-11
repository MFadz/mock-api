import crypto from "crypto";

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
      finance_voucher_no: + prefix +"/"+ randomOne + "/25",
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

export default { 
    mockCreatePayment,
    PaymentReceivables,
    CheckBudget,
    VoucherOneToOnePayTo
};