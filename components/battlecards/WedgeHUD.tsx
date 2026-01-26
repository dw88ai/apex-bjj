import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../constants/colors';

interface WedgeHUDProps {
  wedges: [string, string, string];
}

/**
 * WedgeHUD displays the 3 mechanical wedges/checkpoints for the current position
 * These are the key physical positions to maintain
 */
export function WedgeHUD({ wedges }: WedgeHUDProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>KEY WEDGES</Text>
      {wedges.map((wedge, index) => (
        <View key={index} style={styles.wedgeRow}>
          <View style={styles.numberContainer}>
            <Text style={styles.number}>{index + 1}</Text>
          </View>
          <Text style={styles.wedgeText}>{wedge}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceVariant,
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  header: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 16,
    letterSpacing: 1.5,
  },
  wedgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  numberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  wedgeText: {
    fontSize: 18,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 24,
  },
});
