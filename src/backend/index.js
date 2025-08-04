import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBmuzqdiDo-WngHbEjRXizP51zr6NeWr6I"
});

app.post("/api/translate", async (req, res) => {


  const { text , from, to} = req.body;

  console.log("Received text for translation:", text);
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid input text." });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate the following text from ${from} to ${to}: ${text}. give me the translation only, without any additional text.`,
    });
    res.json({ translation: response.text });
  } catch (error) {
    console.error("Error during translation:", error);
    res.status(500).json({ error: "Failed to translate text." });
  } 

  
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

