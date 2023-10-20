import React from "react";

type CVProps = {
  GPTResponse: string;
};

export default function CV({ GPTResponse }: CVProps) {
  return (
    <div>
      <p>Response from LLM:</p>
      <p>{GPTResponse}</p>
    </div>
  );
}
