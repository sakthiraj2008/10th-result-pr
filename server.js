import express from "express";
import path     from "path";
import fs       from "fs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const DATA = JSON.parse(
  fs.readFileSync(path.resolve("data/results.json"), "utf-8")
);

/**
 * POST /api/result
 * { regNo: "12345", dob: "01/02/2007" }
 */
app.post("/api/result", (req, res) => {
  const { regNo, dob } = req.body || {};
  const rec = DATA.find(
    (r) => r.regNo === regNo && r.dob === dob
  );
  if (!rec) return res.status(404).json({ message: "No record found" });
  res.json(rec);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
