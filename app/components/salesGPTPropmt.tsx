import React, { useState } from "react";
import style from "./salesGPTPrompt.module.scss";
import LabelSelector from "./labelSelector";
import { Message, createMessage, useChatStore } from "../store";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/auth-options";
import { getSpecificProjectData } from "../function/Employees";

type SalesGPTPromptProps = {
  setResponse: (response: string) => void;
  prompt: string;
};

export default function SalesGPTPrompt({ setResponse }: SalesGPTPromptProps) {
  const config = useChatStore((state) => state.config);
  const chatStore = useChatStore();

  // TODO: use these states for propmt
  const [keywordsWeight, setKeywordsWeight] = useState("");
  const [paragrahs, setParagrahs] = useState("");
  const [CVkeywords, setCVKeywords] = useState();
  const [technologyKeywords, setTechnologyKeywords] = useState();
  const [industrykeywords, setIndustryKeywords] = useState();

  // TODO: Refactor this
  const [isLoading, setIsLoading] = useState(false);
  const [session, sessionIndex] = useChatStore((state) => [
    state.currentSession(),
    state.currentSessionIndex,
  ]);
  type RenderMessage = Message & { preview?: boolean };
  const context: RenderMessage[] = session.context.slice();
  const [userInput, setUserInput] = useState("");
  const messages = context
    .concat(session.messages as RenderMessage[])
    .concat(
      isLoading
        ? [
            {
              ...createMessage({
                role: "assistant",
                content: "……",
              }),
              preview: true,
            },
          ]
        : [],
    )
    .concat(
      userInput.length > 0 && config.sendPreviewBubble
        ? [
            {
              ...createMessage({
                role: "user",
                content: userInput,
              }),
              preview: true,
            },
          ]
        : [],
    );
  console.log(messages);
  const lastMessage = messages.slice(-1)[0];

  // -----------------------------------

  const sendMessage = () => {
    chatStore.onUserInput(prompt);
  };

  useChatStore();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
        setResponse(lastMessage?.content);
      }}
    >
      <p>GPT parametere</p>
      <div className={style["input"]}>
        <label>Vekting av nøkkelord:</label>
        <input
          onChange={(e) => setKeywordsWeight(e.target.value)}
          type="text"
        />
      </div>
      <div className={style["input"]}>
        <label>Antall avsnitt:</label>
        <input onChange={(e) => setParagrahs(e.target.value)} type="text" />
      </div>
      <LabelSelector setter={setCVKeywords} title={"Velg nøkkelord for cv"} />
      <LabelSelector setter={setTechnologyKeywords} title={"Velg teknologi"} />
      <LabelSelector setter={setIndustryKeywords} title={"Velg bransje"} />
      <div className={style["buttonDiv"]}>
        <button type="submit" className={style["button"]}>
          Generer tekst
        </button>
      </div>
    </form>
  );
}
