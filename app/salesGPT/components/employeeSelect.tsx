import Select, {
  StylesConfig,
  type DropdownIndicatorProps,
  components,
  OptionProps,
  SingleValueProps,
} from "react-select";
import { EmployeeItem, EmployeeOption } from "../types";
import { useState } from "react";
import Locale from "../../locales";
import SearchIcon from "../../icons/search.svg";
import styles from "./employeeSelect.module.scss";

interface SelectProps {
  employees: EmployeeItem[];
  selectedEmployee: EmployeeItem | undefined;
  handleSelectEmployee: (newValue: EmployeeItem | undefined) => void;
}

const SearchIndicator = ({
  ...props
}: DropdownIndicatorProps<EmployeeOption>) => {
  return (
    <components.DropdownIndicator {...props}>
      <SearchIcon />
    </components.DropdownIndicator>
  );
};

const EmployeeOption = ({ employee }: { employee: EmployeeItem }) => {
  return (
    <div className={styles["option-container"]}>
      {employee?.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={employee.imageUrl}
          width={80}
          height={80}
          alt={`bilde av ${employee.name}`}
        />
      )}
      <span>{employee?.name}</span>
    </div>
  );
};

const OptionWithImage = ({
  children,
  ...props
}: OptionProps<EmployeeOption>) => (
  <components.Option {...props}>
    {props.data.value ? (
      <EmployeeOption employee={props.data.value} />
    ) : (
      children
    )}
  </components.Option>
);

const SingleValue = ({
  children,
  ...props
}: SingleValueProps<EmployeeOption>) => (
  <components.SingleValue {...props}>
    {props.data.value ? (
      <EmployeeOption employee={props.data.value} />
    ) : (
      children
    )}
  </components.SingleValue>
);

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
    height: "7rem",
  }),
  option: (styles) => ({
    ...styles,
    height: "7rem",
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
      components={{
        DropdownIndicator: SearchIndicator,
        Option: OptionWithImage,
        SingleValue: SingleValue,
      }}
    />
  );
}

export default EmployeeSelect;
