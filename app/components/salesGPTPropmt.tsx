import React from "react";
import style from "./salesGPTPrompt.module.scss";
import LabelSelector from "./labelSelector";

export default function SalesGPTPrompt() {
  return (
    <div>
      <p>GPT parametere</p>
      <div className={style.input}>
        <label>Vekting av nøkkelord:</label>
        <input type="text" />
      </div>
      <div className={style.input}>
        <label>Antall avsnitt:</label>
        <input type="text" />
      </div>
      <LabelSelector title={"Velg nøkkelord for cv"} />
      <LabelSelector title={"Velg teknologi"} />
      <LabelSelector title={"Velg bransje"} />
    </div>
  );
}
