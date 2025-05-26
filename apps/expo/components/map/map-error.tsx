import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface MapErrorProps {
  error: string
  style?: object
}

/**
 * Component to display map error states
 */
export function MapError({ error, style }: MapErrorProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
})
