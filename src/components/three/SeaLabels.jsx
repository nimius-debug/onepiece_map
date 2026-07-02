import { Text } from '@react-three/drei'
import { LABEL_FONT } from '../../constants/world3d'

const FlatLabel = ({ position, size = 6, opacity = 0.35, children }) => (
  <Text
    font={LABEL_FONT}
    position={position}
    rotation={[-Math.PI / 2, 0, 0]}
    fontSize={size}
    color="#083A48"
    fillOpacity={opacity}
    letterSpacing={0.25}
    anchorX="center"
    anchorY="middle"
    renderOrder={2}
  >
    {children}
  </Text>
)

/* Sea-region names painted flat onto the water like a chart.
   Positions are verified open water (terrainHeight < -3). */
const SeaLabels = () => (
  <group position={[0, 1.6, 0]}>
    <FlatLabel position={[-138, 0, -45]}>NORTH BLUE</FlatLabel>
    <FlatLabel position={[-138, 0, 55]}>EAST BLUE</FlatLabel>
    <FlatLabel position={[120, 0, -55]}>SOUTH BLUE</FlatLabel>
    <FlatLabel position={[125, 0, 55]}>WEST BLUE</FlatLabel>
    <FlatLabel position={[-30, 0, -40]} size={7} opacity={0.4}>
      GRAND LINE - PARADISE
    </FlatLabel>
    <FlatLabel position={[120, 0, -25]} size={6.5} opacity={0.4}>
      NEW WORLD
    </FlatLabel>
    <FlatLabel position={[55, 0, 9]} size={4} opacity={0.5}>
      CALM BELT
    </FlatLabel>
  </group>
)

export default SeaLabels
