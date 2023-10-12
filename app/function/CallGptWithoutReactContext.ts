import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function requestOpenai(input: ChatCompletionRequestMessage[]) {
  const apiUrl =
    "https://variant-rocks.openai.azure.com/openai/deployments/variant-rocks/chat/completions?api-version=2023-07-01-preview";
  const apiKey = OPENAI_API_KEY; // Replace with your actual API key

  const requestData = {
    messages: input,
    max_tokens: 800,
    temperature: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
    top_p: 1,
    stop: null,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
