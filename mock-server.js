import express from "express";
import dotenv from "dotenv";
import jpnRoutes from "./src/routes/jpn.route.js";
import jkrRoutes from "./src/routes/jkr.route.js";
import mockPaymentRoutes from "./src/routes/mockPayment.route.js";

dotenv.config();
const app = express();
app.use(express.json());

// Mount routers
app.use("/v1/jpn", jpnRoutes);
app.use("/v1/jkr", jkrRoutes);
app.use("/v1/mock", mockPaymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Mock server is running. Use POST endpoints.");
});

const PORT = process.env.MOCK_PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running at http://localhost:${PORT}`);
});
