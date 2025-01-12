import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const getSuggestions = async (message: string): Promise<string[]> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "Your job is to write suggested replies for a messaging app. You will receive a message and should " +
            "return a JSON array with one or two very short suggested responses. Do not wrap the array in a code " +
            "block. Do not include any additional content in your response. Return an empty array if no reasonable " +
            "suggestions can be provided.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });
    const content = completion.choices?.[0]?.message?.content?.trim();
    if (content === undefined) return [];
    return JSON.parse(content);
  } catch {
    return [];
  }
};

export default getSuggestions;
