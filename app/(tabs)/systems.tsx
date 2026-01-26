import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { getAllSystems } from '../../data/battlecards/systemsData';
import * as Haptics from 'expo-haptics';

export default function SystemsTab() {
  const router = useRouter();
  const systems = getAllSystems();

  const handleSystemPress = (systemId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/battlecards/${systemId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>BJJ Systems</Text>
        <Text style={styles.subtitle}>
          Decision trees for high-percentage techniques
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {systems.map((system) => (
          <TouchableOpacity
            key={system.id}
            style={styles.systemCard}
            onPress={() => handleSystemPress(system.id)}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons 
                name="cards" 
                size={24} 
                color={Colors.accent} 
              />
              <Text style={styles.systemTitle}>{system.title}</Text>
            </View>
            <Text style={styles.systemGoal}>{system.goal}</Text>
            <View style={styles.tags}>
              {system.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={styles.wedgePreview}>
              <Text style={styles.wedgePreviewLabel}>
                {system.wedges.length} key wedges
              </Text>
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={20} 
                color={Colors.textSecondary} 
              />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.infoCard}>
          <MaterialCommunityIcons 
            name="information-outline" 
            size={24} 
            color={Colors.primary} 
          />
          <Text style={styles.infoText}>
            Each system provides a decision framework for common BJJ positions. 
            React to your opponent's response and follow the instruction.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  systemCard: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  systemTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  systemGoal: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wedgePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  wedgePreviewLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoCard: {
    backgroundColor: Colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});
