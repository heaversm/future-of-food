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

router.post("/generate", async (req, res) => {
  console.log(req.body);
  const { location, occupation, change, gender, society, society2 } = req.body;
  // return res.json({ message: "received" });

  const prompt1 = `Create digital art of a ${gender} ${occupation} in ${location}, 20 years in the future. The image should show that ${change}. The image should be created in the style of Bauhaus.`;

  const response = await openai.createImage({
    prompt: prompt1,
    n: 4,
    size: "512x512",
  });
  const image_url0 = response.data.data[0].url;
  const image_url1 = response.data.data[1].url;
  const image_url2 = response.data.data[2].url;
  const image_url3 = response.data.data[3].url;
  console.log(image_url0);
  return res.json({
    image_url0,
    image_url1,
    image_url2,
    image_url3,
    message: "success",
  });

  //console.log(req.body);
  //return res.json(req.body);
});

export default router;
