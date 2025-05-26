import { Grid, Map as MapIcon } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

export enum ViewMode {
  EXPLORE = 'explore',
  MAP = 'map',
}

interface ViewToggleButtonProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewToggleButton({ currentView, onViewChange }: ViewToggleButtonProps) {
  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, currentView === ViewMode.EXPLORE ? styles.activeButton : styles.inactiveButton]}
          onPress={() => onViewChange(ViewMode.EXPLORE)}
        >
          <Grid size={18} color={currentView === ViewMode.EXPLORE ? '#fff' : '#888'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, currentView === ViewMode.MAP ? styles.activeButton : styles.inactiveButton]}
          onPress={() => onViewChange(ViewMode.MAP)}
        >
          <MapIcon size={18} color={currentView === ViewMode.MAP ? '#fff' : '#888'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center',
    width: '100%',
    zIndex: 999,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#000',
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
})
