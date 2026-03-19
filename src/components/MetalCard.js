// MetalCard.js
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Loader from './Loader';
import ErrorView from './ErrorView';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = width * 0.82;
export const CARD_HEIGHT = 220;

const METAL_CONFIG = {
  gold: {
    label: 'GOLD',
    symbol: 'Au',
    purity: '24K',
    gradient: ['#B8860B', '#D4AF37', '#FFD700'],
    accent: '#FFD700',
    bg: '#1A1508',
    icon: '◈',
    description: 'The eternal store of value',
  },
  silver: {
    label: 'SILVER',
    symbol: 'Ag',
    purity: '999',
    gradient: ['#7A7A7A', '#C0C0C0', '#E8E8E8'],
    accent: '#C0C0C0',
    bg: '#111214',
    icon: '◇',
    description: 'The industrial precious metal',
  },
  platinum: {
    label: 'PLATINUM',
    symbol: 'Pt',
    purity: '950',
    gradient: ['#5A6978', '#8A9BAD', '#B0C4DE'],
    accent: '#B0C4DE',
    bg: '#0E1318',
    icon: '◉',
    description: 'Rarer than gold',
  },
  palladium: {
    label: 'PALLADIUM',
    symbol: 'Pd',
    purity: '999.5',
    gradient: ['#7B5EA7', '#A080C0', '#C4A8E0'],
    accent: '#C4A8E0',
    bg: '#130E1A',
    icon: '◆',
    description: 'The catalytic powerhouse',
  },
};

const formatPrice = price =>
  price != null
    ? `$${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : '--';

const formatTime = ts => {
  if (!ts) return '--';
  const d = new Date(ts * 1000);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const MetalCard = ({ metalKey, data, loading, error, onPress, onRetry }) => {
  const config = METAL_CONFIG[metalKey];
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (!loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [loading, shimmerAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const isPositive = data?.chp >= 0;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={loading || !!error}
      >
        <View style={[styles.card, { backgroundColor: config.bg }]}>
          {/* Top accent bar */}
          <View
            style={[styles.accentBar, { backgroundColor: config.accent }]}
          />

          {/* Decorative circle */}
          <View
            style={[styles.decorCircle, { borderColor: config.accent + '22' }]}
          />
          <View
            style={[styles.decorCircle2, { borderColor: config.accent + '11' }]}
          />

          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={[styles.metalIcon, { color: config.accent }]}>
                {config.icon}
              </Text>
              <View>
                <Text style={[styles.metalLabel, { color: config.accent }]}>
                  {config.label}
                </Text>
                <Text style={styles.metalDesc}>{config.description}</Text>
              </View>
            </View>
            <View
              style={[
                styles.badge,
                {
                  borderColor: config.accent + '44',
                  backgroundColor: config.accent + '15',
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: config.accent }]}>
                {config.purity}
              </Text>
            </View>
          </View>

          {/* Price section */}
          <View style={styles.priceSection}>
            {loading ? (
              <Loader size="small" color={config.accent} />
            ) : error ? (
              <ErrorView compact onRetry={onRetry} />
            ) : (
              <>
                <Text style={[styles.price, { color: config.accent }]}>
                  {formatPrice(data?.price)}
                  <Text style={styles.priceUnit}> /oz</Text>
                </Text>
                <View
                  style={[
                    styles.changeBadge,
                    {
                      backgroundColor: isPositive ? '#14532D33' : '#7F1D1D33',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.changeText,
                      { color: isPositive ? '#4ADE80' : '#F87171' },
                    ]}
                  >
                    {isPositive ? '▲' : '▼'}{' '}
                    {Math.abs(data?.chp || 0).toFixed(2)}%
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerLabel}>Symbol</Text>
              <Text style={[styles.footerValue, { color: config.accent }]}>
                {config.symbol}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.footerLeft}>
              <Text style={styles.footerLabel}>Updated</Text>
              <Text style={styles.footerValue}>
                {data ? formatTime(data.timestamp) : '--'}
              </Text>
            </View>
            {!loading && !error && (
              <>
                <View style={styles.divider} />
                <View style={styles.footerLeft}>
                  <Text style={styles.footerLabel}>24h Change</Text>
                  <Text
                    style={[
                      styles.footerValue,
                      { color: isPositive ? '#4ADE80' : '#F87171' },
                    ]}
                  >
                    {data?.ch >= 0 ? '+' : ''}
                    {data?.ch?.toFixed(2) ?? '--'}
                  </Text>
                </View>
              </>
            )}
            {!loading && !error && (
              <View
                style={[styles.tapHint, { borderColor: config.accent + '55' }]}
              >
                <Text style={[styles.tapHintText, { color: config.accent }]}>
                  Details →
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffffff0d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 28,
    right: 28,
    height: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    opacity: 0.8,
  },
  decorCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    top: -60,
    right: -50,
  },
  decorCircle2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    top: -100,
    right: -100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metalIcon: {
    fontSize: 26,
    marginRight: 4,
  },
  metalLabel: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  metalDesc: {
    fontSize: 10,
    color: '#555',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  priceSection: {
    flex: 1,
    justifyContent: 'center',
  },
  price: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  changeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ffffff0d',
    paddingTop: 12,
    gap: 12,
  },
  footerLeft: {
    gap: 2,
  },
  footerLabel: {
    fontSize: 9,
    color: '#555',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  footerValue: {
    fontSize: 12,
    color: '#AAA',
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#ffffff0d',
  },
  tapHint: {
    marginLeft: 'auto',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tapHintText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

export default MetalCard;
