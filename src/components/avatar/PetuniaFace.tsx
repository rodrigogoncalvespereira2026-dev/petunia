import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { avatarService } from '../../services/avatar';
import { AvatarExpression } from '../../types/avatar';

interface PetuniaFaceProps {
  size?: number;
}

export function PetuniaFace({ size = 200 }: PetuniaFaceProps) {
  const [expression, setExpression] = useState<AvatarExpression>('neutral');
  const [isBlinking, setIsBlinking] = useState(false);

  const eyeScale = useRef(new Animated.Value(1)).current;
  const mouthScale = useRef(new Animated.Value(0.5)).current;
  const headBob = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    avatarService.startBlinking();
    const unsubscribe = avatarService.onStateChange((expr) => {
      setExpression(expr);
      setIsBlinking(avatarService.isBlinking);
    });
    return () => {
      avatarService.stopBlinking();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(headBob, {
          toValue: 5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(headBob, {
          toValue: -5,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(blinkAnim, {
      toValue: isBlinking ? 0.1 : 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [isBlinking]);

  useEffect(() => {
    const getMouthScale = () => {
      switch (expression) {
        case 'happy':
        case 'excited':
        case 'celebratory':
          return 1;
        case 'surprised':
          return 0.8;
        case 'thinking':
        case 'confused':
          return 0.3;
        case 'sleepy':
          return 0.2;
        default:
          return 0.5;
      }
    };

    Animated.spring(mouthScale, {
      toValue: getMouthScale(),
      useNativeDriver: true,
    }).start();
  }, [expression]);

  const getColor = () => {
    const colors: Record<AvatarExpression, string> = {
      neutral: '#FFB6C1',
      happy: '#FF69B4',
      excited: '#FF1493',
      thinking: '#DB7093',
      surprised: '#FFB347',
      calm: '#87CEEB',
      confused: '#DDA0DD',
      sleepy: '#B0C4DE',
      celebratory: '#FFD700',
    };
    return colors[expression];
  };

  const scale = size / 200;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateY: headBob }],
        },
      ]}
    >
      <View
        style={[
          styles.head,
          {
            width: size * 0.8,
            height: size * 0.8,
            backgroundColor: getColor(),
            borderRadius: size * 0.4,
          },
        ]}
      >
        {/* Left Eye */}
        <View style={[styles.eyeContainer, { left: size * 0.2, top: size * 0.25 }]}>
          <Animated.View
            style={[
              styles.eye,
              {
                width: size * 0.12,
                height: size * 0.12,
                borderRadius: size * 0.06,
                transform: [{ scaleY: blinkAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.pupil,
                {
                  width: size * 0.06,
                  height: size * 0.06,
                  borderRadius: size * 0.03,
                },
              ]}
            />
          </Animated.View>
        </View>

        {/* Right Eye */}
        <View style={[styles.eyeContainer, { right: size * 0.2, top: size * 0.25 }]}>
          <Animated.View
            style={[
              styles.eye,
              {
                width: size * 0.12,
                height: size * 0.12,
                borderRadius: size * 0.06,
                transform: [{ scaleY: blinkAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.pupil,
                {
                  width: size * 0.06,
                  height: size * 0.06,
                  borderRadius: size * 0.03,
                },
              ]}
            />
          </Animated.View>
        </View>

        {/* Left Eyebrow */}
        <View
          style={[
            styles.eyebrow,
            {
              left: size * 0.18,
              top: size * 0.18,
              width: size * 0.15,
              height: size * 0.02,
              transform: [{ rotate: expression === 'surprised' ? '-10deg' : '0deg' }],
            },
          ]}
        />

        {/* Right Eyebrow */}
        <View
          style={[
            styles.eyebrow,
            {
              right: size * 0.18,
              top: size * 0.18,
              width: size * 0.15,
              height: size * 0.02,
              transform: [{ rotate: expression === 'surprised' ? '10deg' : '0deg' }],
            },
          ]}
        />

        {/* Mouth */}
        <Animated.View
          style={[
            styles.mouth,
            {
              bottom: size * 0.2,
              width: size * 0.2,
              height: size * 0.08,
              borderRadius: size * 0.04,
              transform: [{ scaleY: mouthScale }],
            },
          ]}
        />

        {/* Blush */}
        {(expression === 'happy' || expression === 'excited' || expression === 'celebratory') && (
          <>
            <View
              style={[
                styles.blush,
                {
                  left: size * 0.1,
                  top: size * 0.35,
                  width: size * 0.1,
                  height: size * 0.05,
                },
              ]}
            />
            <View
              style={[
                styles.blush,
                {
                  right: size * 0.1,
                  top: size * 0.35,
                  width: size * 0.1,
                  height: size * 0.05,
                },
              ]}
            />
          </>
        )}
      </View>

      {/* Hair accessory */}
      <View
        style={[
          styles.accessory,
          {
            top: size * 0.05,
            right: size * 0.15,
            width: size * 0.15,
            height: size * 0.15,
          },
        ]}
      >
        <View style={[styles.petal, { transform: [{ rotate: '0deg' }] }]} />
        <View style={[styles.petal, { transform: [{ rotate: '72deg' }] }]} />
        <View style={[styles.petal, { transform: [{ rotate: '144deg' }] }]} />
        <View style={[styles.petal, { transform: [{ rotate: '216deg' }] }]} />
        <View style={[styles.petal, { transform: [{ rotate: '288deg' }] }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  eyeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    backgroundColor: '#333',
  },
  eyebrow: {
    position: 'absolute',
    backgroundColor: '#666',
    borderRadius: 2,
  },
  mouth: {
    position: 'absolute',
    backgroundColor: '#E91E63',
  },
  blush: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 150, 150, 0.5)',
    borderRadius: 10,
  },
  accessory: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petal: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#FF69B4',
    borderRadius: 4,
  },
});
