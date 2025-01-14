import React from "react";
import { TextInput, View, Pressable, StyleSheet } from "react-native";

import { Label } from "tamagui";

import { Eye, EyeClosed } from "lucide-react-native";
import { Text } from "tamagui";
import { MontserratFonts } from "@/constants/fonts";
import { Colors } from "@/constants";
import { InputPropsType } from "@/types";

export default function TextInputComponent({
  label,
  placeholder,
  onChange,
  onBlur,
  errors,
  name,
  type = "text",
  value,
}: InputPropsType) {
  const [show, setShow] = React.useState(false);

  return (
    <View style={{ flexDirection: "column", gap: 2, position: "relative" }}>
      {label && (
        <Label
          width={90}
          htmlFor={name}
          style={{
            fontFamily: MontserratFonts.Montserrat_500Medium,
            color: Colors.custom.text,
          }}
        >
          {label}
        </Label>
      )}
      <View style={{ position: "relative" }}>
        <TextInput
          style={{
            borderWidth: 2,
            borderColor: errors[name] ? "#F44336" : "#4f46e5",
            fontSize: 16,
            borderRadius: 8,
            paddingVertical: 11,
            color: "white",
            paddingHorizontal: 16,
            backgroundColor: Colors.custom.background_2,
            margin: 0,
          }}
          secureTextEntry={type === "password" && !show}
          placeholder={placeholder}
          placeholderTextColor={Colors.custom.text_2}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
        />
        {type === "password" && (
          <Pressable
            style={{
              position: "absolute",
              right: 15,

              alignItems: "center",
              justifyContent: "center",
              top: 15,
            }}
            onPress={() => setShow(!show)}
          >
            {show ? (
              <Eye size={24} color={Colors.dark.text} />
            ) : (
              <EyeClosed size={24} color={Colors.dark.text} />
            )}
          </Pressable>
        )}
      </View>
      {errors[name] && (
        <Text
          style={{
            fontFamily: MontserratFonts.Montserrat_400Regular,
            marginTop: 10,
            color: "#F44336",
          }}
        >
          {errors[name].message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  focusRing: {
    borderWidth: 2,
    borderColor: "blue",
  },
});
