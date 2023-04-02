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
  const {
    location,
    occupation,
    change,
    gender,
    community,
    business,
    personal,
    involvement,
    style0,
    artist0,
    mood0,
    architecturalStyle0,
    color01,
    color02,
    medium3,
    water,
    power,
    robots,
  } = req.body;
  // return res.json({ message: "received" });

  const prompt1 = `Uplifting image of a ${gender} ${occupation} in ${location} focusing on ${change}, in the style of ${style0} ${artist0}.`;

  const prompt2 = `A ${mood0}, high angle medium shot view of a ${occupation} in ${location} in tilt shift photography, focusing on ${community} with ${architecturalStyle0} buildings. Dominant colors are ${color01} and ${color02}.`;

  const prompt3 = `An environmental rally ${medium3}, featuring iconic nature symbols, encouraging people to let go of ${personal} and get involved by ${involvement}, in the style of banksy and shepard fairey`;

  const prompt4 = `A cinematic photograph interior 15mm wide angle lens 4k medium view autochrome photo of a ${power} powered factory with ${water} and robots that are ${robots}.`;

  //const prompts = [prompt1, prompt2, prompt3,prompt4];
  const prompts = [prompt4];
  const responses = [];

  for (const prompt of prompts) {
    const response = await openai.createImage({
      prompt: prompt,
      n: 4,
      size: "512x512",
    });
    responses.push(response);
  }

  const imageGroups = [];
  for (const response of responses) {
    const imageArray = [];
    for (let i = 0; i < 4; i++) {
      imageArray.push(response.data.data[i].url);
    }
    imageGroups.push(imageArray);
  }

  return res.json({
    imageGroups,
    message: "success",
  });

  //console.log(req.body);
  //return res.json(req.body);
});

export default router;
