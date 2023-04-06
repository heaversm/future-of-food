import path from "path";
import express from "express";
import { nanoid } from "nanoid";
import formData from "form-data";
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

const openAiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAiConfiguration);

const router = express.Router();

let storyteller, storytellerProfession, ethnicity, gender, occupation, location;

router.post("/generate", async (req, res) => {
  // console.log(req.body);

  const formID = parseInt(req.body.formID);
  let prompt, story;
  if (formID === 0) {
    const { change, style0, artist0 } = req.body;

    ethnicity = req.body.ethnicity;
    gender = req.body.gender;
    occupation = req.body.occupation;
    location = req.body.location;
    storytellerProfession = req.body.storytellerProfession;
    storyteller = req.body.storyteller;

    prompt = `Uplifting image of a ${ethnicity} ${gender} ${occupation} in ${location} focusing on ${change}, in the style of ${style0} ${artist0}.`;

    story = `It's the year 2040, and we're in ${location}. Food and agriculture has changed a lot in the last 20 years. The biggest change is ${change}. I'm working as a ${occupation}. Rewrite the previous two sentences as an uplifting intro to an award winning novel in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.`;
  } else if (formID === 1) {
    const {
      mood0,
      community,
      architecturalStyle0,
      color01,
      color02,
      politics,
      business,
    } = req.body;

    prompt = `A ${mood0}, high angle medium shot view of a ${occupation} in ${location} with lots of trees, plants, and water in tilt shift nature photography , focusing on ${community} with ${architecturalStyle0} housing. Dominant colors are ${color01} and ${color02}`;

    story = `In my community, ${community}. Politically, ${politics}, and on the business side of things, ${business}. Rewrite this with a ${mood0} mood, in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.`;
  } else if (formID === 2) {
    const { medium3, personal, involvement } = req.body;

    prompt = `An environmental rally ${medium3}, featuring iconic nature symbols, encouraging people to let go of ${personal} and get involved by ${involvement}, in the style of banksy and soviet propaganda art`;

    story = `I did have to give up ${personal}, but I also got involved by ${involvement}. We got the word out with ${medium3}. Rewrite this in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.}`;
  } else if (formID === 3) {
    const { power, water, robots } = req.body;

    prompt = `A cinematic photograph interior 15mm wide angle lens 4k medium view autochrome photo of a ${power} powered factory with ${water} and robots that are ${robots}.`;

    story = `We're making great progress on clean energy too. We're using ${power} to power our factories, and our water comes from ${water}. As for the robots, ${robots}. Rewrite this in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.}`;
  } else if (formID === 4) {
    const { animal1, animal2, animal3 } = req.body;

    prompt = `An adorable cinematic movie photograph from avatar the last airbender of a ${animal1} that can ${animal3}`;

    story = `The ${animal1} love it because ${animal2}, so now they can ${animal3}. Rewrite this in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.`;
  } else if (formID === 5) {
    const { food, market, market2, preparation } = req.body;

    prompt = `A James Beard award winning photo of ${food} modernist cuisine on a table at ${market} in cinematic lighting.`;

    story = `But on to my favorite topic, food. My favorite place to go is ${market} because ${market2}. The weirdest food I've tried is ${food}, which you make by ${preparation}. Rewrite this in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.`;
  }

  const response = await openai.createImage({
    prompt: prompt,
    n: 4,
    size: "512x512",
  });

  const imageArray = [];
  for (let i = 0; i < 4; i++) {
    imageArray.push(response.data.data[i].url);
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: story }],
  });

  const storyResponse = completion.data.choices[0].message.content;

  return res.json({
    imageArray,
    storyResponse,
    formID,
    message: "Success",
  });
});

export default router;
