
import { Colors } from "@/constants";
import { sizes } from "@/constants/sizes";
import SearchBar from "@/features/chat/sidebar-search-bar";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Separator, View } from "tamagui"; 

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: Colors.custom.background,
            width: 300,
          },
          drawerType: "slide",
          headerShown: false,
        }}
        drawerContent={(props) => <DrawerContent {...props} />}
      ></Drawer>
    </GestureHandlerRootView>
  );
}
const DrawerContent = (props: DrawerContentComponentProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };
  return (
    <DrawerContentScrollView {...props} style={{ padding: sizes.marginSM }}>
      <SearchBar
        placeholder="Search items"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <Separator style={{ marginVertical: sizes.marginSM }} />

      <View style={{ width: "100%" }}></View>
    </DrawerContentScrollView>
  );
};
