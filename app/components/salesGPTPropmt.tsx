import React from "react";
import style from "./salesGPTPrompt.module.scss";
import LabelSelector from "./labelSelector";

type SalesGPTPromptProps = {
  setKeywordsWeight: Function;
  setParagrahs: Function;
  setCVKeywords: Function;
  setTechnologyKeywords: Function;
  setIndustryKeywords: Function;
};

export default function SalesGPTPrompt({
  setKeywordsWeight,
  setParagrahs,
  setCVKeywords,
  setTechnologyKeywords,
  setIndustryKeywords,
}: SalesGPTPromptProps) {
  return (
    <div>
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
        <button className={style["button"]}>Generer tekst</button>
      </div>
    </div>
  );
}
