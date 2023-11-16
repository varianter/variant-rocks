import Select, { StylesConfig } from "react-select";
import { HelpOption } from "../types";
import { Dispatch, SetStateAction } from "react";

interface SelectProps {
  options: HelpOption[];
  selectedHelp: HelpOption | undefined;
  handleSelectHelp: Dispatch<SetStateAction<HelpOption>>;
}

const selectStyles: StylesConfig<HelpOption> = {
  placeholder: (styles) => ({
    ...styles,
    color: "var(--text-light)",
    fontSize: "1rem",
    fontWeight: "400",
  }),
  indicatorSeparator: () => ({ display: "hidden" }),
  control: (styles) => ({
    ...styles,
    borderRadius: "0.7rem",
    borderColor: "var(--white)",
    padding: ".4rem",
  }),
};

function HelpSelect({ options, selectedHelp, handleSelectHelp }: SelectProps) {
  function onChange(newValue: HelpOption): void {
    handleSelectHelp(newValue);
  }

  return (
    <Select
      options={options}
      isSearchable={false}
      value={selectedHelp}
      // @ts-ignore
      onChange={onChange}
      id="choose-help"
      isClearable={false}
      styles={selectStyles}
    />
  );
}

export default HelpSelect;
