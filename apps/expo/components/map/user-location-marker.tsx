import { MarkerView } from '@maplibre/maplibre-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'

interface UserLocationMarkerProps {
  longitude: number
  latitude: number
}

/**
 * Component to display the user's current location on the map
 */
export function UserLocationMarker({ longitude, latitude }: UserLocationMarkerProps) {
  return (
    <MarkerView id="userLocation" coordinate={[longitude, latitude]} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={styles.userLocationMarker} />
    </MarkerView>
  )
}

const styles = StyleSheet.create({
  userLocationMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})
