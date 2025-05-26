import { TransportMode } from '@prio-state'
import { Bike, Car, FootprintsIcon } from 'lucide-react-native'

// Icon mapping for transport modes
export const TRANSPORT_ICONS = {
  [TransportMode.FOOT]: FootprintsIcon,
  [TransportMode.BIKE]: Bike,
  [TransportMode.CAR]: Car,
}
