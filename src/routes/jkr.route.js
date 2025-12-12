import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const koordinat = JSON.parse(fs.readFileSync(path.resolve("src/data/koordinatTanahData.json")));

router.post("/koordinatTanah", (req, res) => {
  const lot = req.body?.req_param?.lot_no || req.body?.lot_no || "not provided";
  const result = koordinat[lot];
  res.json(result
    ? { success: true, message: "Mocked Koordinat Tanah", data: { ...result, lot_no: lot } }
    : { success: false, message: "Lot not found", data: { lot_no: lot } });
});

export default router;
