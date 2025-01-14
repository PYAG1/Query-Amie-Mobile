import { signIn } from "@/api";
import TextInputComponent from "@/components/ui/TextInput";

import { Colors } from "@/constants";
import { MontserratFonts } from "@/constants/fonts";
import { sizes } from "@/constants/sizes";
import { saveItem } from "@/lib/helpers";
import {
    SignInSchema,
    SignInType
} from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Keyboard,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Index() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: (response) => {
      Toast.show({
        type: "success",
        text1: "Successfully logged in",
        text2: "Welcome to QueryAmie",
        text2Style: {
          fontSize: sizes.fontSize[2],
          color: "black",
          fontFamily: MontserratFonts.Montserrat_600SemiBold,
        },
        visibilityTime: 3000,
      });

      saveItem(
        "userDetails",
        JSON.stringify({
          accessToken: response?.access_token,
          userId: response?.user_id,
        })
      );

      setTimeout(() => {
        router.push("/chat");
      }, 3000);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);

      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: errorMessage,
        text2Style: {
          fontSize: sizes.fontSize[2],
          color: "black",
          fontFamily: MontserratFonts.Montserrat_600SemiBold,
        },
        visibilityTime: 4000,
      });
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInType>({
    defaultValues: {
      username: "pyagkmmrr",
      password: "pyag2334455",
    },
    resolver: zodResolver(SignInSchema),
  });
  //pyag344r@gmail.com
  //Papa Yawkmmr
  //pyag2334455
  //pyagkmmrr
  const onSubmit: SubmitHandler<SignInType> = (data: SignInType) => {
    Keyboard.dismiss();

    // Create a FormData object
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    console.log("here", formData);
    mutate(formData);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.custom.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 30,
              paddingBottom: 120, // Increased padding to account for button height
            }}
          >
            <View className="w-full p-5 flex justify-center items-center">
              <Text
                className="text-lg text-gray-300"
                style={{ fontFamily: MontserratFonts.Montserrat_600SemiBold }}
              >
                Welcome
              </Text>
            </View>

            <View>
              <Text
                className="text-4xl"
                style={{
                  fontFamily: "Montserrat_600SemiBold",
                  color: Colors.light.primary,
                }}
              >
                Welcome Backkk!
              </Text>
              <Text className="text-gray-500 text-lg">
                Please enter your details to continue.
              </Text>
            </View>

            <View style={{ marginTop: 20 }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    placeholder="Username"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    name="username"
                    label="Username"
                    errors={errors}
                    type={undefined}
                  />
                )}
                name="username"
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    placeholder="Enter your password"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    name="password"
                    label="Password"
                    errors={errors}
                    type="password"
                  />
                )}
                name="password"
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Colors.custom.background,
          paddingHorizontal: 20,
          paddingVertical: Platform.OS === "ios" ? 30 : 20,
          // borderTopWidth: 1,
          borderTopColor: "#eee",
          // Add shadow
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={{
            backgroundColor: Colors.custom.accent_1,
            paddingVertical: 15,
            borderRadius: 100,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 16,
              fontFamily: "Montserrat_600SemiBold",
            }}
          >
            {isPending ? <ActivityIndicator /> : "Submit"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
