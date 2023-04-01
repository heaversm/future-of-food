import path from "path";
import express from "express";
import { nanoid } from "nanoid";
import formData from "form-data";
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

console.log(process.env.OPENAI_API_KEY, "openAI");

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfiguration);

const router = express.Router();

router.get("/generate", async (req, res) => {
  const response = await openai.createImage({
    prompt: "a white siamese cat",
    n: 1,
    size: "1024x1024",
  });
  const image_url = response.data.data[0].url;
  console.log(image_url);
  return res.json({ image_url });

  //console.log(req.body);
  //return res.json(req.body);
});

export default router;
