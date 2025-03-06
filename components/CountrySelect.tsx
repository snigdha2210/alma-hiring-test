"use client";
import React from "react";
import Select from "react-select";
import countryList from "react-select-country-list";

type CountryOption = {
  value: string;
  label: string;
};

interface CountrySelectProps {
  value: CountryOption | null;
  onChange: (value: CountryOption | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
  const options = countryList().getData();

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder='Select Country of Citizenship'
    />
  );
};

export default CountrySelect;
