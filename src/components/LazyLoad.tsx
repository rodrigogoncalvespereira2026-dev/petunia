import React, { Suspense, lazy } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants';

const LoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={Colors.primary} />
  </View>
);

export const LazyChatScreen = lazy(() => 
  import('../components/chat/ChatScreen').then(m => ({ default: m.ChatScreen }))
);

export const LazyMemoryScreen = lazy(() => 
  import('../components/memory/MemoryScreen').then(m => ({ default: m.MemoryScreen }))
);

export const LazyToolsScreen = lazy(() => 
  import('../components/tools/ToolsScreen').then(m => ({ default: m.ToolsScreen }))
);

export const LazyFilesScreen = lazy(() => 
  import('../components/files/FilesScreen').then(m => ({ default: m.FilesScreen }))
);

export const LazyAvatarScreen = lazy(() => 
  import('../components/avatar/AvatarScreen').then(m => ({ default: m.AvatarScreen }))
);

export function withLazyLoading<T extends object>(
  Component: React.ComponentType<T>
): React.FC<T> {
  return function LazyComponent(props: T) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
