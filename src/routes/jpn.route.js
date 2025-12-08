import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Load datasets
const hidupMati = JSON.parse(fs.readFileSync(path.resolve("src/data/hidupMatiData.json")));
const alamat = JSON.parse(fs.readFileSync(path.resolve("src/data/alamatData.json")));

router.post("/hidupMati", (req, res) => {
  // console.log("start hidupMati")
  const ic = req.body?.req_param?.ic_number || req.body?.ic_number || "not provided";
  const result = hidupMati[ic];
  res.json(result
    ? { success: true, message: "Mocked JPN Data", data: { ...result, ic_number: ic } }
    : { success: false, message: "IC not found", data: { ic_number: ic } });
});

router.post("/alamat", (req, res) => {
  const ic = req.body?.req_param?.ic_number || req.body?.ic_number || "not provided";
  const result = alamat[ic];
  res.json(result
    ? { success: true, message: "Mocked Alamat", data: { ...result, ic_number: ic } }
    : { success: false, message: "Alamat not found", data: { ic_number: ic } });
});

export default router;
