// HomeScreen.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import MetalCard, { CARD_WIDTH, CARD_HEIGHT } from '../components/MetalCard';
import useMetalPrice from '../hooks/useMetalPrice';

const { width } = Dimensions.get('window');
const SPACER = (width - CARD_WIDTH) / 2 - 10;

const METALS = ['gold', 'silver', 'platinum', 'palladium'];

const METAL_COLORS = {
  gold: '#D4AF37',
  silver: '#C0C0C0',
  platinum: '#B0C4DE',
  palladium: '#C4A8E0',
};

// Individual metal hook wrapper
const MetalItem = ({ metalKey, onPress }) => {
  const { data, loading, error, refresh } = useMetalPrice(metalKey);
  return (
    <MetalCard
      metalKey={metalKey}
      data={data}
      loading={loading}
      error={error}
      onRetry={refresh}
      onPress={() => onPress(metalKey, data)}
    />
  );
};

const HomeScreen = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMetalPress = (metalKey, data) => {
    if (data) {
      navigation.navigate('Details', { metalKey, data });
    }
  };

  const data = [
    { key: 'left-spacer' },
    ...METALS.map(m => ({ key: m })),
    { key: 'right-spacer' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>LIVE MARKETS</Text>
          <Text style={styles.headerTitle}>Precious Metals</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Prices in USD · Updated every 30s</Text>

      {/* Carousel */}
      <View style={styles.carouselWrapper}>
        <Animated.FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={e => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / (CARD_WIDTH + 20),
            );
            setActiveIndex(Math.max(0, Math.min(idx, METALS.length - 1)));
          }}
          keyExtractor={item => item.key}
          renderItem={({ item, index }) => {
            if (item.key === 'left-spacer' || item.key === 'right-spacer') {
              return <View style={{ width: SPACER }} />;
            }

            const realIndex = index - 1;
            const inputRange = [
              (realIndex - 1) * (CARD_WIDTH + 20),
              realIndex * (CARD_WIDTH + 20),
              (realIndex + 1) * (CARD_WIDTH + 20),
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.9, 1, 0.9],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View style={{ transform: [{ scale }], opacity }}>
                <MetalItem metalKey={item.key} onPress={handleMetalPress} />
              </Animated.View>
            );
          }}
        />
      </View>

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {METALS.map((m, i) => (
          <View
            key={m}
            style={[
              styles.dot,
              activeIndex === i && {
                backgroundColor: METAL_COLORS[m],
                width: 20,
              },
            ]}
          />
        ))}
      </View>

      {/* Metal label */}
      <Text
        style={[
          styles.activeLabel,
          { color: METAL_COLORS[METALS[activeIndex]] },
        ]}
      >
        {METALS[activeIndex].toUpperCase()}
      </Text>

      {/* Market Stats Footer */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>MARKET</Text>
          <Text style={[styles.statValue, { color: '#4ADE80' }]}>OPEN</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>CURRENCY</Text>
          <Text style={styles.statValue}>USD</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>METALS</Text>
          <Text style={styles.statValue}>{METALS.length}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  headerEyebrow: {
    fontSize: 10,
    color: '#555',
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F5F5F5',
    letterSpacing: -0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#14532D33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4ADE8033',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  liveText: {
    fontSize: 10,
    color: '#4ADE80',
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#444',
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 32,
    letterSpacing: 0.3,
  },
  carouselWrapper: {
    height: CARD_HEIGHT + 20,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
  },
  activeLabel: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 12,
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 'auto',
    marginBottom: 32,
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 9,
    color: '#444',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 14,
    color: '#CCC',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#1E1E1E',
  },
});

export default HomeScreen;
