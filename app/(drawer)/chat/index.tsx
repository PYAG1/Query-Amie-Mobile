import { UploadDocuments } from "@/api";

import { Colors } from "@/constants";
import { MontserratFonts } from "@/constants/fonts";
import { sizes } from "@/constants/sizes";
import MessageBubble from "@/features/chat/message-bubble";
import FilePreview from "@/features/chat/preview-selected-files";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getMimeType } from "@/lib/helpers";
import { Chat } from "@/types";
import { DrawerActions } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { AlignLeft, Paperclip, Send } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";
const dummyChat: Chat[] = [
  { id: "1", message: "Hello! How can I assist you today?", type: "ai" },
  { id: "2", message: "What is React Native?", type: "user" },
  {
    id: "3",
    message:
      "React Native is a framework for building mobile apps using React.",
    type: "ai",
  },
  {
    id: "4",
    message: "Can I use it for both iOS and Android?",
    type: "user",
  },
  {
    id: "5",
    message:
      "Yes, it supports cross-platform development for both iOS and Android.",
    type: "ai",
  },
];
export default function Index() {
  const navigation = useNavigation();
  const [chatHistory, setChatHistory] = useState<Chat[]>(dummyChat);
  const { selectedFiles, pickDocument, removeFile } = useFileUpload();

  const {
    isSuccess,
    isPending,
    isError,
    error,
    mutate: uploadFiles,
  } = useMutation({
    mutationKey: ["UploadDocs"],
    mutationFn: UploadDocuments,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { prompt: "" },
  });
  const handleFormSubmit = async () => {
    if (selectedFiles.length < 1) {
      Alert.alert("No Document Uploaded", "Please upload a document first.");
      return;
    }
  
    try {
      const formData = new FormData();
      
   
      selectedFiles.forEach((file) => {
        formData.append("files", {
          uri: file.uri,
          type: file.mimeType,  // Use the mimeType from FileInfo
          name: file.name,
          size: file.size
        } as any);
      });
  
  
      console.log("Uploading files:", selectedFiles.map(f => ({
        name: f.name,
        type: f.mimeType,
        size: f.size
      })));
  
      await uploadFiles(formData);
      
   
      
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error preparing files:", error);

    }
  };
  if (isPending) return <View style={{width:"100%",flex:1,backgroundColor:"r"}}>
    <Text style={{color:"black"}}>Hi</Text>
  </View>;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <AlignLeft size={25} color={Colors.custom.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0: 0}
      >
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
          >
            {chatHistory?.length === 0 ? (
              <View style={styles.welcomeContainer}>
                <YStack alignItems="center">
                  <Text style={styles.welcomeTitle}>
                    Hi there, Welcome to{" "}
                    <Text style={styles.accentText}>QueryAmie</Text>
                  </Text>
                  <Text style={styles.welcomeSubtitle}>
                    Upload a document(s) to begin!
                  </Text>
                </YStack>
              </View>
            ) : (
              chatHistory.map((chat, index) => (
                <MessageBubble
                  key={index}
                  message={chat.message}
                  isUser={chat.type === "user"}
                />
              ))
            )}
          </ScrollView>

          {selectedFiles.length > 0 && (
            <FilePreview files={selectedFiles} onRemove={removeFile} />
          )}

          <View style={styles.inputContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputWrapper}>
                    <Pressable
                      onPress={pickDocument}
                      style={styles.uploadButton}
                    >
                      <Paperclip
                        size={20}
                        color={Colors.custom.text}
                        style={{ transform: [{ rotate: "45deg" }] }}
                      />
                    </Pressable>

                    <TextInput
                      placeholder="Type your message..."
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[
                        styles.input,
                        errors.prompt && styles.inputError,
                        selectedFiles && styles.inputWithFile,
                      ]}
                      placeholderTextColor={Colors.custom.text_2}
                      multiline={false}
                    />

                    <TouchableOpacity
                      onPress={handleFormSubmit}
                      style={styles.sendButton}
                    >
                      <Send size={20} color={Colors.custom.accent_3} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              name="prompt"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.custom.background,
    paddingBottom:10
  },
  header: {
    padding: sizes.marginSM,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 15,
    flexGrow: 1,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  welcomeTitle: {
    fontFamily: MontserratFonts.Montserrat_600SemiBold,
    fontSize: sizes.fontSize[5],
    color: Colors.custom.text,
  },
  accentText: {
    color: Colors.custom.accent_3,
  },
  welcomeSubtitle: {
    fontFamily: MontserratFonts.Montserrat_300Light,
    fontSize: sizes.fontSize[3],
    color: Colors.custom.text,
  },
  inputContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: Colors.custom.background,
  },
  container: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: Colors.custom.background,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uploadButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#4f46e5",
    fontSize: 16,
    borderRadius: 30,
    paddingVertical: Platform.OS === "ios" ? 11 : 8,
    paddingHorizontal: 16,
    color: "white",
    backgroundColor: Colors.custom.background_2,
    maxHeight: 100,
  },
  inputError: {
    borderColor: "#F44336",
  },
  inputWithFile: {
    borderColor: Colors.custom.accent_3,
  },
  sendButton: {
    padding: sizes.marginSM - 7,
    justifyContent: "center",
    alignItems: "center",
    //  backgroundColor:"#11112e",
    //  borderRadius:50
  },
  fileIndicator: {
    marginTop: 4,
    paddingHorizontal: 12,
  },
  fileText: {
    color: Colors.custom.text_2,
    fontSize: 12,
    fontStyle: "italic",
  },
});
