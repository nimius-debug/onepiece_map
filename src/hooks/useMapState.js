import { useState, useCallback } from 'react'

export const useMapState = () => {
  const [activeSaga, setActiveSaga]           = useState(null)
  const [hoveredLocation, setHoveredLocation] = useState(null)
  const [pinnedLocation, setPinnedLocation]   = useState(null)
  const [tooltipPos, setTooltipPos]           = useState({ x: -9999, y: -9999 })

  const handleHover = useCallback((location, pos) => {
    if (!pinnedLocation) {
      setHoveredLocation(location)
      if (pos) setTooltipPos(pos)
    }
  }, [pinnedLocation])

  const handleLeave = useCallback(() => {
    if (!pinnedLocation) setHoveredLocation(null)
  }, [pinnedLocation])

  const handleClick = useCallback((location, pos) => {
    if (pos) setTooltipPos(pos)
    setPinnedLocation((prev) => prev?.id === location.id ? null : location)
    setHoveredLocation(null)
  }, [])

  const handleClosePin = useCallback(() => {
    setPinnedLocation(null)
    setHoveredLocation(null)
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
    tooltipPos,
    onHover: handleHover,
    onLeave: handleLeave,
    onClick: handleClick,
    onClosePin: handleClosePin,
  }
}
