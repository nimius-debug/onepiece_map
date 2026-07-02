import { Text } from '@react-three/drei'
import { WORLD_W, WORLD_H, GL_Z, RL1_X, RL2_X, LABEL_FONT } from '../../constants/world3d'

const FlatLabel = ({ position, size = 6, opacity = 0.5, children }) => (
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
  >
    {children}
  </Text>
)

// Sea-region names painted flat onto the water like a chart
const SeaLabels = () => {
  const westX = (RL1_X - WORLD_W / 2) / 2          // between west edge and RL1
  const paradiseX = (RL1_X + RL2_X) / 2            // between the two Red Lines
  const nwX = (RL2_X + WORLD_W / 2) / 2            // east of RL2

  return (
    <group position={[0, 0.9, 0]}>
      <FlatLabel position={[westX, 0, -WORLD_H / 3.2]}>NORTH BLUE</FlatLabel>
      <FlatLabel position={[westX, 0, WORLD_H / 3.4]}>EAST BLUE</FlatLabel>
      <FlatLabel position={[nwX, 0, WORLD_H / 3.4]}>WEST BLUE</FlatLabel>
      <FlatLabel position={[nwX, 0, -WORLD_H / 3.2]}>SOUTH BLUE</FlatLabel>
      <FlatLabel position={[paradiseX, 0, GL_Z - 26]} size={8} opacity={0.55}>
        GRAND LINE - PARADISE
      </FlatLabel>
      <FlatLabel position={[nwX, 0, GL_Z - 16]} size={6.5} opacity={0.55}>
        NEW WORLD
      </FlatLabel>
      <FlatLabel position={[paradiseX, 0, GL_Z + 15]} size={4} opacity={0.75}>
        CALM BELT
      </FlatLabel>
    </group>
  )
}

export default SeaLabels
