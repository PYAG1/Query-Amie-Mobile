import { StartChat, UploadDocuments } from "@/api";
import { Colors } from "@/constants";
import { MontserratFonts } from "@/constants/fonts";
import { sizes } from "@/constants/sizes";
import MessageBubble from "@/features/chat/message-bubble";
import FilePreview from "@/features/chat/preview-selected-files";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ChatHistory } from "@/types";
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

export default function Index() {
  const navigation = useNavigation();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const { selectedFiles, pickDocument, removeFile } = useFileUpload();

  const chatMutation = useMutation({
    mutationFn: StartChat,
    onSuccess: (response) => {
   
      setChatHistory(prev => [
        ...prev, response?.data as ChatHistory
      ]);
      form.reset({ question: "" });
    },
    onError: () => {
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  });

  const uploadMutation = useMutation({
    mutationKey: ["UploadDocs"],
    mutationFn: UploadDocuments,
    onSuccess: () => {
      setIsDocumentUploaded(true);
      setChatHistory([{ 
        id: "initial", 
        question: "", 
        answer: "Documents uploaded successfully! How can I help you?" 
      }]);
    },
    onError: () => {
      Alert.alert("Error", "Failed to upload documents. Please try again.");
    }
  });
  

  const form = useForm({
    defaultValues: { question: "" }
  });

  const handleUploadDocuments = async () => {
    if (selectedFiles.length < 1) {
      Alert.alert("No Document Uploaded", "Please upload a document first.");
      return;
    }

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
          size: file.size,
        } as any);
      });

      await uploadMutation.mutateAsync(formData);
      Keyboard.dismiss();
    } catch (error) {
      console.error("Error preparing files:", error);
    }
  };

  const handleSendMessage = form.handleSubmit((data) => {
    if (!isDocumentUploaded) {
      Alert.alert("Upload Required", "Please upload and process documents first.");
      return;
    }

    if (!data.question.trim()) {
      return;
    }

    chatMutation.mutate({question:data.question});
  });

  if (uploadMutation.isPending) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Uploading and processing documents...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <AlignLeft size={25} color={Colors.custom.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50: 50}
      >
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
          >
            {chatHistory.length === 0 ? (
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
              chatHistory.map((chat) => (
                <View key={chat.id}>
                  {chat.question && (
                    <MessageBubble message={chat.question} isUser={true} isLoading={chatMutation?.isPending} />
                  )}
                  {chat.answer && (
                    <MessageBubble message={chat.answer} isUser={false} />
                  )}
                </View>
              ))
            )}
          </ScrollView>

          {selectedFiles.length > 0 && (
            <FilePreview files={selectedFiles} onRemove={removeFile} />
          )}

          <View style={styles.inputContainer}>
            <Controller
              control={form.control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View style={styles.inputWrapper}>
                    <Pressable
                      onPress={pickDocument}
                      style={styles.uploadButton}
                      disabled={isDocumentUploaded}
                    >
                      <Paperclip
                        size={20}
                        color={isDocumentUploaded ? Colors.custom.text_2 : Colors.custom.text}
                        style={{ transform: [{ rotate: "45deg" }] }}
                      />
                    </Pressable>

                    <TextInput
                      placeholder={isDocumentUploaded ? "Type your message..." : "Upload documents first..."}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={[
                        styles.input,
                        !isDocumentUploaded && styles.inputDisabled,
                        selectedFiles.length > 0 && styles.inputWithFile,
                      ]}
                      placeholderTextColor={Colors.custom.text_2}
                      multiline={false}
                      editable={isDocumentUploaded}
                    />

                    <TouchableOpacity
                      onPress={isDocumentUploaded ? handleSendMessage : handleUploadDocuments}
                      style={[
                        styles.sendButton,
                        (chatMutation.isPending || uploadMutation.isPending) && styles.sendButtonDisabled
                      ]}
                      disabled={chatMutation.isPending || uploadMutation.isPending}
                    >
                      <Send size={20} color={Colors.custom.accent_3} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              name="question"
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
    paddingBottom: 10,
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
  inputDisabled: {
    opacity: 0.5,
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.custom.background,
  }, 
   
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingText: {

    fontSize: sizes.fontSize[3],
    color: Colors.custom.text,
  },
});
