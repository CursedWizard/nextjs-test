import {OptionBase, Props, Select} from "chakra-react-select"
import React, {useRef, useState} from "react"
type CategorySelectProps = Props<EntityType, false> & {

        chakraStyles?: Props["chakraStyles"];
  };

export interface EntityType extends OptionBase {
  label: string;
  value: string | number;
}

export const CategorySelect: React.FC<CategorySelectProps> = (props) => {
  const { options, placeholder, onChange, value, id } = props;
  const selectRef = useRef(null);
  const [scrollPosition, setScrollPosition ] = useState(0);

  return (
    <Select<EntityType, false>
      id={id}
      ref={selectRef}
      instanceId={id}
      name={id}
      options={options}
      placeholder={placeholder}
      closeMenuOnSelect={true}
      size="md"
      focusBorderColor="green.500"
      selectedOptionStyle={"color"}
      selectedOptionColor="green"
      onChange={onChange}
      value={value}
      useBasicStyles
      menuShouldScrollIntoView={true}
      captureMenuScroll={true}
      chakraStyles={props.chakraStyles}
    />
  );
};
