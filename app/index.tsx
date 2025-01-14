import { Colors } from '@/constants';
import Button from '@/features/onboarding/Button';
import ListItem from '@/features/onboarding/ListItem';
import PaginationElement from '@/features/onboarding/Pagination';
import { useCallback } from 'react';
import {
    ImageURISource,
    SafeAreaView,
    StyleSheet,
    View,
    ViewToken
} from 'react-native';
import Animated, {
    useAnimatedRef,
    useAnimatedScrollHandler,
    useSharedValue,
} from 'react-native-reanimated';


const pages = [
  {
    text: 'Trusted by millions of people, part of one part',
          description: 'Ask questions and get accurate answers instantly.',
    image: require('../assets/images/ai.png'),
  },
  {
    text: 'Spend money abroad, and track your expense',
          description: 'Upload PDFs, Word docs, PowerPoints, and more.',
    image: require('../assets/images/multimedia.png'),
  },
  {
    text: 'Receive Money From Anywhere In The World',
          description: 'Extract key information and insights in seconds.',
    image: require('../assets/images/analysis.png'),
  },
];
export default function App() {
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<
    Animated.FlatList<{
      text: string;
      image: ImageURISource;
      description:string
    }>
  >();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      flatListIndex.value = viewableItems[0].index ?? 0;
    },
    []
  );
  const scrollHandle = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { text: string; image: ImageURISource; description:string };
      index: number;
    }) => {
      return <ListItem item={item} index={index} x={x} />;
    },
    [x]
  );
  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        scrollEventThrottle={16}
        pagingEnabled={true}
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        bounces={false}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles.bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
        <Button
          currentIndex={flatListIndex}
          length={pages.length}
          flatListRef={flatListRef}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.custom.background
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom:15
  },
});


