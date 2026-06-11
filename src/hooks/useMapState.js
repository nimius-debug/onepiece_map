import { useState, useCallback } from 'react'

export const useMapState = () => {
  const [activeSaga, setActiveSaga]           = useState(null)
  const [hoveredLocation, setHoveredLocation] = useState(null)
  const [pinnedLocation, setPinnedLocation]   = useState(null)

  const handleHover = useCallback((location) => {
    if (!pinnedLocation) setHoveredLocation(location)
  }, [pinnedLocation])

  const handleLeave = useCallback(() => {
    if (!pinnedLocation) setHoveredLocation(null)
  }, [pinnedLocation])

  const handleClick = useCallback((location) => {
    setPinnedLocation((prev) =>
      prev?.id === location.id ? null : location
    )
    setHoveredLocation(null)
  }, [])

  const handleClosePin = useCallback(() => {
    setPinnedLocation(null)
  }, [])

  const handleSetActiveSaga = useCallback((saga) => {
    setActiveSaga(saga)
    setPinnedLocation(null)
    setHoveredLocation(null)
  }, [])

  const visibleLocation = pinnedLocation ?? hoveredLocation

  return {
    activeSaga,
    setActiveSaga: handleSetActiveSaga,
    hoveredLocation,
    pinnedLocation,
    visibleLocation,
    onHover: handleHover,
    onLeave: handleLeave,
    onClick: handleClick,
    onClosePin: handleClosePin,
  }
}
