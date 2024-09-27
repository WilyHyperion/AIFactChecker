import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_GEMINI, 

);
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];
const systemInstruction = "You are an advanced fact checking ai. You will recive a chunk of text from a debate, and return a JSON list of the statements and if they are true, false, or not should not answer. For statements that are too minor to answer, are opinions, or are not verifiable respond with 'should not answer' for their vaildity. Ignore text that appears as if it was said by a debate moderator. Error on the side of answering with true or false even if the statement is vague. Consider the surronding statements when making you decision. Additonally, include a third key that includes your reasoning. For example [{statement: '...', validity: 'true', reason: '...'} ]   "
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction : systemInstruction, generationConfig: {
  responseMimeType: "application/json"
}, safetySettings: safetySettings });
const splitterSystem  = "You are a formating AI. Given a chunk of text from a debate, split the text into groups by statements or claims. If a statement appears cut off still respond it. Format your response with | as a delimiter between statements, and always respond with a rehash of the original, never give reasoning. For example statement1|statement2|statement3";
const splitterModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction : splitterSystem });
async function splitByStatement(text: any)  {
  const prompt = `${text}`;
  try {
    const result = await splitterModel.generateContent(prompt);
    const responseText = result.response.text();
    return responseText.split("|");
  } catch (error) {
    console.error('Error splitting cotent:', error);
    throw error;
  }
}
async function getResponse(sentence: any)  {
  const prompt = `${sentence}`;
  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log(responseText);
    return JSON.stringify({value: responseText});
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

export default {
    getResponse: getResponse,
    splitByStatement: splitByStatement,
    getResponseBulk: async (text: any, title : any) => {
      
      try {
        
       let response = await model.generateContent(title + ":" + text)

      let r = response.response.text()
      console.log(r)
      return r
      } catch (error) {
        console.log(error)
        console.log(text)
      }
    }

}