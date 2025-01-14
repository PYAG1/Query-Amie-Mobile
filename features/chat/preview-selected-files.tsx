import { Colors } from "@/constants";
import { CircleX } from "lucide-react-native";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { Text, View, XStack } from "tamagui";

type FileInfo = {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
};

type FilePreviewProps = {
  files: FileInfo[];
  onRemove: (index: number) => void;
};

export default function FilePreview({ files, onRemove }: FilePreviewProps) {
  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        horizontal
        data={files}
        keyExtractor={(item, index) => `${item.uri}-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.fileCard}>
            <XStack gap={10}>
              <Text style={styles.fileName}>
                {item.name || "Unnamed File"}
              </Text>
              <Pressable onPress={() => onRemove(index)}>
                <CircleX size={20} color={"white"} />
              </Pressable>
            </XStack>
            <Text style={styles.fileInfo}>
              {formatFileSize(item.size)} • {item.mimeType?.split('/')[1].toUpperCase()}
            </Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: Colors.custom.background_2,
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
  fileCard: {
    position: "relative",
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.custom.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 150,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.custom.text,
    flexShrink: 1,
  },
  fileInfo: {
    fontSize: 12,
    color: Colors.custom.text_2,
    marginTop: 4,
  },
});