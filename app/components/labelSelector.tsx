import React, { useRef, useState } from "react";
import style from "./labelSelector.module.scss";

type Label = {
  text: string;
  active: boolean;
};

type LabelSelectorProps = {
  title: string;
};

export default function LabelSelector({ title }: LabelSelectorProps) {
  // Labels handeling
  const [labels, setLabels] = useState<Label[]>();
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");

  const handleLabelClick = (label: Label) => {
    const updatedLabels = labels?.map((l) => {
      if (l.text === label.text) {
        return { ...l, active: !l.active };
      }
      return l;
    });
    setLabels(updatedLabels);
  };

  const addLabel = (labelText: string) => {
    const updatedLabels = labels
      ? [...labels, { text: labelText, active: false }]
      : [{ text: labelText, active: false }];
    setLabels(updatedLabels);
  };

  return (
    <div>
      <p className={style["title"]}>{title}</p>
      <div className={style["labels"]}>
        {labels &&
          labels.map((label) => {
            return (
              <label
                key={label.text}
                onClick={() => handleLabelClick(label)}
                className={
                  label.active ? style["label-active"] : style["label"]
                }
              >
                {label.text}
              </label>
            );
          })}
        <form
          className={style["label"]}
          onClick={() => setShowInput(true)}
          onSubmit={(e) => {
            e.preventDefault();
            addLabel(input);
            setInput("");
            setShowInput(false);
          }}
        >
          {showInput ? (
            <input type="text" onChange={(e) => setInput(e.target.value)} />
          ) : (
            <label>+</label>
          )}
        </form>
      </div>
    </div>
  );
}
