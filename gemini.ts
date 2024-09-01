const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_GEMINI, 

);

const systemInstruction = "You are an advanced fact checking AI. Given a statement, you must determine the validity of the statement. Respond with only the words 'true,' 'false,' 'should not answer.' You should return 'true' if the statement is verifiably true, 'false' if it is blatantly incorrect (even if the statement is phrased as an opinion), 'should not answer' if the statement is an opinion with no claim about reality, or if the claim is intuitively verifiable (and thus too minor of a statement to have to fact check). Still respond to poltical statements with true or false";
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction : systemInstruction });
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
}