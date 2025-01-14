
import { MontserratFonts } from "@/constants/fonts";
import { SignUp, SignUpSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
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

import { Link, useRouter } from "expo-router";

import { signUp } from "@/api";
import TextInputComponent from "@/components/ui/TextInput";
import { Colors } from "@/constants";
import { sizes } from "@/constants/sizes";
import Toast from "react-native-toast-message";

export default function Index() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>({
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(SignUpSchema),
  });

  const { isPending, mutate, error, isError, isSuccess } = useMutation({
    mutationFn: signUp,
    onSuccess: (response) => {
   
      Toast.show({
        type: "success",
        text1: "Account Created",
        text2: "You can now log in to your account",
        text2Style:{fontSize:sizes.fontSize[2],color:"black",fontFamily:MontserratFonts.Montserrat_600SemiBold},
        visibilityTime: 3000,
      });
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);

    
    },
    onError: (error: any) => {
    
      const errorMessage = 
        error.response?.data?.detail || 
        error.message || 
        "An unexpected error occurred";

      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: errorMessage,
        text2Style:{fontSize:sizes.fontSize[2],color:"black",fontFamily:MontserratFonts.Montserrat_600SemiBold},
        visibilityTime: 4000,
      });
    }
  });

  const onSubmit = (data: SignUp) => {
   
    Keyboard.dismiss();

    const { confirmPassword, ...formattedData } = data;

    mutate(formattedData);
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
              paddingBottom: 120, 
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
                Create an account
              </Text>
              <Text className="text-gray-500 text-lg">
                Please enter your details to get started
              </Text>
            </View>

            <View style={{ marginTop: 20 }}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    placeholder="First name"
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
                    placeholder="Full name"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    name="full_name"
                    label="Full Name"
                    errors={errors}
                    type={undefined}
                  />
                )}
                name="full_name"
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    placeholder="Enter your email"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    name="email"
                    label="Email"
                    errors={errors}
                    type={undefined}
                  />
                )}
                name="email"
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
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputComponent
                    placeholder="Confirm Password"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    name="confirmPassword"
                    label="Confirm "
                    errors={errors}
                    type={undefined}
                  />
                )}
                name="confirmPassword"
              />
              <Link href={"/auth/signin"} style={{color:"white",textDecorationLine:"underline",marginVertical:sizes.marginSM}}>Already have an account?</Link>
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
          //borderTopWidth: 1,
          borderTopColor: "#eee",
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
         {
          isPending ? (<ActivityIndicator/>):("Submit")
         }
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
