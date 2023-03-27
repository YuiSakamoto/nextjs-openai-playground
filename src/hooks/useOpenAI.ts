import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export const useOpenAI = () => {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key is not set.");
  }
  const configuration = new Configuration({
    apiKey: apiKey,
  });

  const model = "gpt-3.5-turbo-0301";

  async function generateResponse(messages: Message[]) {
    setLoading(true);
    try {
      const openai = new OpenAIApi(configuration);
      const response = await openai.createChatCompletion({
        model: model,
        messages: messages,
      });

      const content = response.data.choices[0]?.message?.content;
      if (content) {
        setResponse(content);
      } else {
        setResponse("生成された文章がありません。入力を確認してください。");
      }
    } catch (error) {
      setResponse(
        "エラーが発生しました。しばらく待ってから再試行してください。"
      );
    } finally {
      setLoading(false);
    }
  }

  return { response, loading, generateResponse };
};
