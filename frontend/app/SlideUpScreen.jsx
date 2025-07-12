import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Pressable } from 'react-native';

const SlideUpScreen = ({ children, onClose }) => {
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <>
      <Pressable style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
        {children}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    height: '60%',
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
});

export default SlideUpScreen;
