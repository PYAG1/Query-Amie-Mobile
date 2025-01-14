import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { Colors } from '@/constants';
import { Bot } from 'lucide-react-native';

const MessageBubble = ({ message, isUser, isLoading = false }: { message: string; isUser: boolean; isLoading?: boolean }) => {
  return (
    <View>
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        {!isUser && <View style={styles.botIconContainer}><Bot size={20} color="white" /></View>}
        
        {!isUser && isLoading ? (
          <LoadingDots />
        ) : (
          <Text style={styles.messageText}>{message}</Text>
        )}
      </View>
    </View>
  );
};


const LoadingDots = () => {
  const dotScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotScale, { toValue: 1.5, duration: 300, useNativeDriver: true }),
        Animated.timing(dotScale, { toValue: 1, duration: 300, useNativeDriver: true }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [dotScale]);

  return (
    <View style={styles.loadingDots}>
      {[0, 1, 2].map((_, index) => (
        <Animated.View key={index} style={[styles.dot, { transform: [{ scale: dotScale }] }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    marginBottom: 20,
  },
  userBubble: {
    backgroundColor: Colors.custom.accent_1,
    alignSelf: 'flex-end',
  },
  botBubble: {
   // backgroundColor: Colors.custom.background_2,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  botIconContainer: {
    backgroundColor: Colors.custom.accent_3,
    borderRadius: 15,
    padding: 5,
    marginRight: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    flexShrink: 1,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 40,
  },
  dot: {
    backgroundColor: 'white',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});

export default MessageBubble;
