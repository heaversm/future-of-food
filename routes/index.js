import path from "path";
import process from "process";
import express from "express";

const router = express.Router();
const templates = path.join(process.cwd(), "templates");

router.get("/", (req, res) => {
  res.sendFile("index.html", { root: templates });
});

router.get("/:urlId", async (req, res) => {
  try {
    console.log("get id", req.params.urlId);
    res.json({
      urlId: req.params.urlId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

export default router;
