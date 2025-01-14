import AsyncStorage from '@react-native-async-storage/async-storage';
export const saveItem = async (key:string, value:string) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value)); // Convert to string before saving
      console.log('Item saved successfully');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  export const getItem = async (key:string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log('Retrieved item:', JSON.parse(value)); // Parse string back to original format
        return JSON.parse(value);
      } else {
        console.log('No item found');
      }
    } catch (error) {
      console.error('Error retrieving item:', error);
    }
  };
  

  export const getMimeType = (uri: string) => {
    const extension = uri.split('.').pop()?.toLowerCase() || '';
    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/msword',
      txt: 'text/plain',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  };
  
  export const truncateFileName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength ? `${name.slice(0, maxLength - 3)}...` : name;
  };