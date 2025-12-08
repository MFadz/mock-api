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