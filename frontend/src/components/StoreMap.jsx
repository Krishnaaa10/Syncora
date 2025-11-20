import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const StoreMap = ({ stores, selectedStore, onStoreSelect, onMarkerClick, userLocation }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapRef.current || stores.length === 0) return

    // Filter stores with valid locations
    const storesWithLocation = stores.filter(s => s.location && s.location.lat && s.location.lng)
    
    if (storesWithLocation.length === 0) return

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      // Calculate center (Bhopal center as fallback)
      const bhopalCenter = [23.2599, 77.4126]
      let center = bhopalCenter
      let bounds = null

      if (storesWithLocation.length > 0) {
        const lats = storesWithLocation.map(s => s.location.lat)
        const lngs = storesWithLocation.map(s => s.location.lng)
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length
        center = [avgLat, avgLng]

        if (storesWithLocation.length > 1) {
          bounds = L.latLngBounds(
            storesWithLocation.map(s => [s.location.lat, s.location.lng])
          )
        }
      }

      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current, {
        center,
        zoom: storesWithLocation.length === 1 ? 15 : 12,
        zoomControl: true,
        attributionControl: true,
      })

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)

      // Fit bounds if multiple stores
      if (bounds && storesWithLocation.length > 1) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
      }
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Add user location marker if available
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: 'user-location-marker',
          html: `
            <div style="
              position: relative;
              width: 48px;
              height: 48px;
            ">
              <!-- Pulsing Ring -->
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 48px;
                height: 48px;
                border: 3px solid #3b82f6;
                border-radius: 50%;
                animation: userLocationRing 2s ease-out infinite;
                opacity: 0.6;
              "></div>
              <!-- Main Marker -->
              <div style="
                position: relative;
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                border: 5px solid white;
                border-radius: 50%;
                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 4px 20px rgba(59, 130, 246, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: userLocationPulse 2s ease-in-out infinite;
              ">
                <div style="
                  width: 20px;
                  height: 20px;
                  background-color: white;
                  border-radius: 50%;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                "></div>
                <!-- Status Dot -->
                <div style="
                  position: absolute;
                  top: -4px;
                  right: -4px;
                  width: 16px;
                  height: 16px;
                  background-color: #10b981;
                  border: 2px solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.5);
                "></div>
              </div>
            </div>
            <style>
              @keyframes userLocationPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              @keyframes userLocationRing {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
              }
            </style>
          `,
          iconSize: [48, 48],
          iconAnchor: [24, 24],
        }),
        zIndexOffset: 2000,
      }).addTo(mapInstanceRef.current)

      const userPopup = L.popup({
        className: 'user-popup',
      }).setContent(`
        <div style="padding: 8px; min-width: 150px; text-align: center;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px; color: #3b82f6;">
            Your Location
          </h3>
          <p style="margin: 0; font-size: 12px; color: #666;">
            ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}
          </p>
        </div>
      `)

      userMarker.bindPopup(userPopup)
      markersRef.current.push(userMarker)
    }

    // Create custom icon for markers
    const createCustomIcon = (isSelected) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            background-color: #ec4899;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: ${isSelected ? '12px' : '8px'};
              height: ${isSelected ? '12px' : '8px'};
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
      })
    }

    // Add markers for all stores
    storesWithLocation.forEach((store) => {
      const isSelected = selectedStore && selectedStore.Store_ID === store.Store_ID
      
      const marker = L.marker([store.location.lat, store.location.lng], {
        icon: createCustomIcon(isSelected),
        zIndexOffset: isSelected ? 1000 : 1,
      }).addTo(mapInstanceRef.current)

      // Create popup
      const popup = L.popup({
        className: 'store-popup',
      }).setContent(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #ec4899;">
            ${store.Name}
          </h3>
          <p style="margin: 0; font-size: 13px; color: #666;">
            ${store.address}
          </p>
        </div>
      `)

      marker.bindPopup(popup)

      // Add click handler
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(store)
        }
      })

      markersRef.current.push(marker)

      // Open popup for selected store
      if (isSelected) {
        setTimeout(() => {
          marker.openPopup()
        }, 300)
      }
    })

    // Update map view if bounds changed
    if (userLocation && userLocation.lat && userLocation.lng) {
      // Include user location in bounds
      const allPoints = [
        [userLocation.lat, userLocation.lng],
        ...storesWithLocation.map(s => [s.location.lat, s.location.lng])
      ]
      const bounds = L.latLngBounds(allPoints)
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
    } else if (storesWithLocation.length > 1) {
      const bounds = L.latLngBounds(
        storesWithLocation.map(s => [s.location.lat, s.location.lng])
      )
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(marker)
        }
      })
    }
  }, [stores, selectedStore, onMarkerClick, userLocation])

  // Update marker icons when selectedStore changes
  useEffect(() => {
    if (!mapInstanceRef.current || markersRef.current.length === 0) return

    const createCustomIcon = (isSelected) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            background-color: #ec4899;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: ${isSelected ? '12px' : '8px'};
              height: ${isSelected ? '12px' : '8px'};
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
      })
    }

    markersRef.current.forEach((marker, index) => {
      const store = stores[index]
      if (store && store.location) {
        const isSelected = selectedStore && selectedStore.Store_ID === store.Store_ID
        marker.setIcon(createCustomIcon(isSelected))
        marker.setZIndexOffset(isSelected ? 1000 : 1)

        // Open popup for selected store
        if (isSelected) {
          marker.openPopup()
        }
      }
    })
  }, [selectedStore, stores])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      markersRef.current = []
    }
  }, [])

  return (
    <div className="w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden border border-gray-800"
        style={{ minHeight: '100%' }}
      />
    </div>
  )
}

export default StoreMap
