import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PlansScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plans</Text>
      <Text style={styles.subtitle}>
        Training plans management
      </Text>
      <Text style={styles.placeholder}>
        Placeholder - Plans list to be implemented in Sprint 3
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  placeholder: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
