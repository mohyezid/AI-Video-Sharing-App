import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({
  text,
  handlePress,
  containerStyles,
  textStyle,
  isloading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary-100 rounded-xl min-h-[62px] justify-center items-center  ${containerStyles} ${
        isloading ? "opacity-50" : ""
      }`}
      disabled={isloading}
    >
      <Text className={`text-primary font-psemibold text-lg   ${textStyle}`}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
