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
    ethnicity,
    community,
    politics,
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
    animal1,
    animal2,
    animal3,
    food,
    market,
    market2,
    preparation,
    media,
    future,
    factor1,
    factor2,
    factor3,
    storyteller,
    storytellerProfession,
  } = req.body;
  // return res.json({ message: "received" });

  const prompt1 = `Uplifting image of a ${ethnicity} ${gender} ${occupation} in ${location} focusing on ${change}, in the style of ${style0} ${artist0}.`;

  const story1 = `It's the year 2040, and we're in ${location}. Food and agriculture has changed a lot in the last 20 years. The biggest change is ${change}. I'm working as a ${occupation}. Rewrite the previous two sentences as an uplifting intro to an award winning novel in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.`;

  const prompt2 = `A ${mood0}, high angle medium shot view of a ${occupation} in ${location} with lots of trees, plants, and water in tilt shift nature photography , focusing on ${community} with ${architecturalStyle0} housing. Dominant colors are ${color01} and ${color02}`;

  const story2 = `In my community, ${community}. Politically, ${politics}, and on the business side of things, ${business}. Rewrite this with a ${mood0} mood, in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.`;

  const prompt3 = `An environmental rally ${medium3}, featuring iconic nature symbols, encouraging people to let go of ${personal} and get involved by ${involvement}, in the style of banksy and soviet propaganda art`;

  const story3 = `I did have to give up ${personal}, but I also got involved by ${involvement}. We got the word out with ${medium3}. Rewrite this in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.}`;

  const prompt4 = `A cinematic photograph interior 15mm wide angle lens 4k medium view autochrome photo of a ${power} powered factory with ${water} and robots that are ${robots}.`;

  const story4 = `We're making great progress on clean energy too. We're using ${power} to power our factories, and our water comes from ${water}. As for the robots, ${robots}. Rewrite this in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.}`;

  const prompt5 = `An adorable cinematic movie photograph from avatar the last airbender of a ${animal1} that can ${animal3}`;

  const story5 = `The ${animal1} love it because ${animal2}, so now they can ${animal3}. Rewrite this in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.`;

  const prompt6 = `A James Beard award winning photo of ${food} modernist cuisine on a table at ${market} in cinematic lighting.`;

  const story6 = `But on to my favorite topic, food. My favorite place to go is ${market} because ${market2}. The weirdest food I've tried is ${food}, which you make by ${preparation}. Rewrite this in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.`;

  const prompt7 = `An inspiring cinematic movie photograph from ${media} of ${future} .`;

  const story7 = `When I think about the future, the thing I most hope for is ${future}. We can make it happen if ${factor1}, ${factor2}, and ${factor3}. Rewrite this as the conclusion to a story, in the style of ${storytellerProfession} ${storyteller}, in first-person voice. Limit your response to one paragraph of less than 250 words.}`;

  const prompts = [
    prompt1,
    prompt2,
    prompt3,
    prompt4,
    prompt5,
    prompt6,
    prompt7,
  ];
  // const prompts = [prompt7];
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
  const stories = [story1, story2, story3, story4, story5, story6, story7];
  // const stories = [story7];
  const storyCompletions = [];

  for (const story of stories) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: story }],
    });
    storyCompletions.push(completion.data.choices[0].message.content);
  }

  return res.json({
    imageGroups,
    storyCompletions,
    message: "success",
  });

  //console.log(req.body);
  //return res.json(req.body);
});

export default router;
