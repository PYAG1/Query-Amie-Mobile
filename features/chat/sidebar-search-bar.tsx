import { Colors } from '@/constants';
import { Search } from 'lucide-react-native';
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';


const SearchBar = ({ placeholder, onChangeText, value }:any) => {
  return (
    <View style={styles.container}>
      <Search size={20} color="white" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search..."}
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor="white"
    
    
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:Colors.custom.accent_2,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "white",
    
  },
});

export default SearchBar;
