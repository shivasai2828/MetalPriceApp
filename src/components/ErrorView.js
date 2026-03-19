// ErrorView.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ErrorView = ({
  message = 'Something went wrong',
  onRetry,
  compact = false,
}) => {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactIcon}>⚠</Text>
        <Text style={styles.compactText}>Failed to load</Text>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.compactRetry}>
            <Text style={styles.compactRetryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Unable to load data</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E5E5E5',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryText: {
    color: '#0A0A0A',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  // Compact styles (used inside MetalCard)
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  compactIcon: {
    fontSize: 14,
    color: '#E8A838',
  },
  compactText: {
    fontSize: 12,
    color: '#999',
  },
  compactRetry: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  compactRetryText: {
    fontSize: 11,
    color: '#D4AF37',
    fontWeight: '600',
  },
});

export default ErrorView;
