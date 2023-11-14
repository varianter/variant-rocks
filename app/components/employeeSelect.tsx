import Select, {
  StylesConfig,
  type DropdownIndicatorProps,
  components,
} from "react-select";
import { EmployeeItem, EmployeeOption } from "../salesGPT/types";
import { useState } from "react";
import Locale from "../locales";
import SearchIcon from "../icons/search.svg";

interface SelectProps {
  employees: EmployeeItem[];
  selectedEmployee: EmployeeItem | undefined;
  handleSelectEmployee: (newValue: EmployeeItem | undefined) => void;
}

const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <SearchIcon />
    </components.DropdownIndicator>
  );
};

const selectStyles: StylesConfig<EmployeeOption> = {
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
  }),
};

function EmployeeSelect({
  employees,
  selectedEmployee,
  handleSelectEmployee,
}: SelectProps) {
  const initialValue = selectedEmployee
    ? { label: selectedEmployee?.name ?? "", value: selectedEmployee }
    : null;
  const [selectedOption, setSelectEmployee] = useState<EmployeeOption | null>(
    initialValue,
  );

  const options: EmployeeOption[] = employees.map((emp: EmployeeItem) => ({
    value: emp,
    label: emp.name,
  }));

  function onChange(newValue: EmployeeOption): void {
    setSelectEmployee(newValue);
    handleSelectEmployee(newValue?.value);
  }

  function onClear(): void {
    setSelectEmployee(null);
    handleSelectEmployee(undefined);
  }

  const placeholder = Locale.SalesGPT.SelectPlaceholder ?? "Choose employee";

  return (
    <Select
      options={options}
      isSearchable={true}
      value={selectedOption}
      // @ts-ignore
      onChange={onChange}
      id="choose-employee"
      placeholder={placeholder}
      isClearable={true}
      clearValue={onClear}
      // @ts-ignore
      styles={selectStyles}
      components={{ DropdownIndicator }}
    />
  );
}

export default EmployeeSelect;
