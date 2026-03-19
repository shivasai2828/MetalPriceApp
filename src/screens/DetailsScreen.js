// DetailsScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import useMetalPrice from '../hooks/useMetalPrice';
import Loader from '../components/Loader';
import ErrorView from '../components/ErrorView';

const METAL_CONFIG = {
  gold: {
    label: 'GOLD',
    symbol: 'Au',
    atomicNumber: 79,
    purity: '24K',
    accent: '#D4AF37',
    bg: '#1A1508',
    icon: '◈',
    description:
      'Gold is a chemical element with the symbol Au. It is a highly sought-after precious metal used in jewelry, electronics, and as a financial instrument.',
  },
  silver: {
    label: 'SILVER',
    symbol: 'Ag',
    atomicNumber: 47,
    purity: '999',
    accent: '#C0C0C0',
    bg: '#111214',
    icon: '◇',
    description:
      'Silver is a precious metal with the highest electrical conductivity of any element. It is widely used in industry, jewelry, and investment.',
  },
  platinum: {
    label: 'PLATINUM',
    symbol: 'Pt',
    atomicNumber: 78,
    purity: '950',
    accent: '#B0C4DE',
    bg: '#0E1318',
    icon: '◉',
    description:
      'Platinum is one of the rarest metals on Earth. It is used in catalytic converters, jewelry, and various industrial applications.',
  },
  palladium: {
    label: 'PALLADIUM',
    symbol: 'Pd',
    atomicNumber: 46,
    purity: '999.5',
    accent: '#C4A8E0',
    bg: '#130E1A',
    icon: '◆',
    description:
      'Palladium is a rare, lustrous silvery-white metal. It is primarily used in catalytic converters for automobiles and in electronics.',
  },
};

const formatPrice = price =>
  price != null
    ? `$${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : '--';

const formatDateTime = () => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const StatRow = ({ label, value, valueColor, accent }) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={[styles.statValueWrap, { borderColor: accent + '22' }]}>
      <Text style={[styles.statValue, valueColor ? { color: valueColor } : {}]}>
        {value}
      </Text>
    </View>
  </View>
);

const DetailsScreen = ({ route, navigation }) => {
  const { metalKey, data: initialData } = route.params;
  const config = METAL_CONFIG[metalKey];
  const { data, loading, error, refresh, lastUpdated } =
    useMetalPrice(metalKey);

  const liveData = data || initialData;
  const isPositive = (liveData?.chp ?? 0) >= 0;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={[styles.container, { backgroundColor: '#080808' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#080808" />

      {/* Custom Header */}
      <View
        style={[styles.header, { borderBottomColor: config.accent + '22' }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={[styles.backIcon, { color: config.accent }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerIcon, { color: config.accent }]}>
            {config.icon}
          </Text>
          <Text style={[styles.headerTitle, { color: config.accent }]}>
            {config.label}
          </Text>
        </View>
        <TouchableOpacity onPress={refresh} style={styles.refreshBtn}>
          <Text style={{ color: config.accent, fontSize: 18 }}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* Hero Price Card */}
          <View
            style={[
              styles.heroCard,
              { backgroundColor: config.bg, borderColor: config.accent + '22' },
            ]}
          >
            <View
              style={[styles.heroBorderTop, { backgroundColor: config.accent }]}
            />

            <View style={styles.symbolRow}>
              <View
                style={[
                  styles.symbolBox,
                  {
                    borderColor: config.accent + '44',
                    backgroundColor: config.accent + '15',
                  },
                ]}
              >
                <Text style={[styles.symbolText, { color: config.accent }]}>
                  {config.symbol}
                </Text>
                <Text style={styles.atomicNum}>{config.atomicNumber}</Text>
              </View>
              <View style={styles.symbolInfo}>
                <Text style={[styles.purityBadge, { color: config.accent }]}>
                  PURITY: {config.purity}
                </Text>
                <Text style={styles.currencyLabel}>USD / TROY OZ</Text>
              </View>
            </View>

            {loading && !liveData ? (
              <Loader size="large" color={config.accent} />
            ) : error && !liveData ? (
              <ErrorView message={error} onRetry={refresh} />
            ) : (
              <>
                <Text style={[styles.heroPrice, { color: config.accent }]}>
                  {formatPrice(liveData?.price)}
                </Text>
                <View style={styles.changeRow}>
                  <View
                    style={[
                      styles.changePill,
                      {
                        backgroundColor: isPositive ? '#14532D44' : '#7F1D1D44',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.changeVal,
                        { color: isPositive ? '#4ADE80' : '#F87171' },
                      ]}
                    >
                      {isPositive ? '▲' : '▼'}{' '}
                      {formatPrice(Math.abs(liveData?.ch ?? 0))}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.changePill,
                      {
                        backgroundColor: isPositive ? '#14532D44' : '#7F1D1D44',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.changeVal,
                        { color: isPositive ? '#4ADE80' : '#F87171' },
                      ]}
                    >
                      {isPositive ? '+' : ''}
                      {liveData?.chp?.toFixed(2) ?? '--'}%
                    </Text>
                  </View>
                </View>
              </>
            )}

            <Text style={styles.datetime}>{formatDateTime()}</Text>
          </View>

          {/* Price Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: config.accent }]}>
              PRICE DATA
            </Text>
            <View
              style={[styles.statsCard, { borderColor: config.accent + '15' }]}
            >
              <StatRow
                label="Current Price"
                value={formatPrice(liveData?.price)}
                valueColor={config.accent}
                accent={config.accent}
              />
              <StatRow
                label="Open Price"
                value={formatPrice(liveData?.open_price)}
                accent={config.accent}
              />
              <StatRow
                label="Previous Close"
                value={formatPrice(liveData?.prev_close_price)}
                accent={config.accent}
              />
              <StatRow
                label="Day High"
                value={formatPrice(liveData?.high_price)}
                valueColor="#4ADE80"
                accent={config.accent}
              />
              <StatRow
                label="Day Low"
                value={formatPrice(liveData?.low_price)}
                valueColor="#F87171"
                accent={config.accent}
              />
              <StatRow
                label="Ask"
                value={formatPrice(liveData?.ask)}
                accent={config.accent}
              />
              <StatRow
                label="Bid"
                value={formatPrice(liveData?.bid)}
                accent={config.accent}
              />
            </View>
          </View>

          {/* Per Gram Prices */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: config.accent }]}>
              PRICE PER GRAM
            </Text>
            <View style={styles.gramGrid}>
              {[
                { k: '24K', val: liveData?.price_gram_24k },
                { k: '22K', val: liveData?.price_gram_22k },
                { k: '21K', val: liveData?.price_gram_21k },
                { k: '20K', val: liveData?.price_gram_20k },
                { k: '18K', val: liveData?.price_gram_18k },
                { k: '16K', val: liveData?.price_gram_16k },
                { k: '14K', val: liveData?.price_gram_14k },
                { k: '10K', val: liveData?.price_gram_10k },
              ].map(item => (
                <View
                  key={item.k}
                  style={[
                    styles.gramCard,
                    {
                      borderColor: config.accent + '22',
                      backgroundColor: config.bg,
                    },
                  ]}
                >
                  <Text style={[styles.gramLabel, { color: config.accent }]}>
                    {item.k}
                  </Text>
                  <Text style={styles.gramValue}>
                    {item.val ? `$${item.val.toFixed(3)}` : '--'}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: config.accent }]}>
              ABOUT
            </Text>
            <View
              style={[styles.aboutCard, { borderColor: config.accent + '15' }]}
            >
              <Text style={styles.aboutText}>{config.description}</Text>
            </View>
          </View>

          {/* Last Updated */}
          {lastUpdated && (
            <Text style={styles.lastUpdated}>
              Last refreshed: {lastUpdated.toLocaleTimeString()}
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
  },
  backIcon: {
    fontSize: 22,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  refreshBtn: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  heroBorderTop: {
    position: 'absolute',
    top: 0,
    left: 32,
    right: 32,
    height: 2,
    opacity: 0.7,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  symbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  symbolBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 20,
    fontWeight: '800',
  },
  atomicNum: {
    fontSize: 9,
    color: '#555',
    position: 'absolute',
    top: 6,
    right: 8,
  },
  symbolInfo: {
    gap: 4,
  },
  purityBadge: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  currencyLabel: {
    fontSize: 10,
    color: '#555',
    letterSpacing: 1,
  },
  heroPrice: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 12,
  },
  changeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  changePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  changeVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  datetime: {
    fontSize: 11,
    color: '#444',
    letterSpacing: 0.3,
    borderTopWidth: 1,
    borderTopColor: '#ffffff0d',
    paddingTop: 12,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.5,
    paddingHorizontal: 4,
  },
  statsCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  statValueWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 13,
    color: '#CCC',
    fontWeight: '700',
  },
  gramGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  gramCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  gramLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  gramValue: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  aboutCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  aboutText: {
    fontSize: 13,
    color: '#777',
    lineHeight: 22,
  },
  lastUpdated: {
    textAlign: 'center',
    fontSize: 11,
    color: '#333',
    marginTop: 4,
  },
});

export default DetailsScreen;
