import * as DocumentPicker from 'expo-document-picker';
import { useState } from "react";
import { Alert } from 'react-native';

type FileInfo = {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
};

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

const isValidFileType = (mimeType: string, filename: string): boolean => {

  if (ALLOWED_TYPES.has(mimeType)) {
    return true;
  }
  const ext = getFileExtension(filename);
  return ['pdf', 'txt', 'doc', 'docx'].includes(ext);
};

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'text/plain',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const invalidFiles = result.assets.filter(
          asset => !isValidFileType(asset.mimeType ?? '', asset.name)
        );

        if (invalidFiles.length > 0) {
          Alert.alert(
            'Invalid File Type',
            'Please upload only PDF, TXT, or DOC/DOCX files.',
            [{ text: 'OK' }]
          );
          return;
        }


        const oversizedFiles = result.assets.filter(
          asset => (asset.size ?? 0) > MAX_FILE_SIZE
        );

        if (oversizedFiles.length > 0) {
          Alert.alert(
            'File Too Large',
            'Files must be smaller than 10MB.',
            [{ text: 'OK' }]
          );
          return;
        }

        setSelectedFiles((prevFiles) => {
          const existingFileUris = new Set(prevFiles.map(file => file.uri));
          
          const newFiles = result.assets
            .filter(asset => !existingFileUris.has(asset.uri))
            .map(asset => ({
              uri: asset.uri,
              name: asset.name,
              size: asset.size ?? 0,
              mimeType: asset.mimeType ?? '',
            }));

          return [...prevFiles, ...newFiles];
        });
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Alert.alert(
        'Error',
        'Failed to select document. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    pickDocument,
    removeFile,
    clearFiles,
  };
};