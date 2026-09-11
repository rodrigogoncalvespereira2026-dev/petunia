import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PetuniaFace } from './PetuniaFace';

export function MiniAvatar() {
  return (
    <View style={styles.container}>
      <PetuniaFace size={40} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
  },
});
