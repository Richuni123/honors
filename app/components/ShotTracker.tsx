import React, { useState } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api'

const mapContainerStyle = {
	width: '100%',
	height: '100vh',
}

const center = {
	lat: 49.2085,
	lng: -2.219,
}

const whiteTee = {
	lat: 49.210028,
	lng: -2.217806,
}

type LatLng = { lat: number; lng: number }
type Shot = { start: LatLng; end: LatLng | null }

const ShotTracker = () => {
	const [shots, setShots] = useState<Shot[]>([{ start: whiteTee, end: null }])
	const [currentShot, setCurrentShot] = useState(1)

	const handleMapClick = (event: google.maps.MapMouseEvent) => {
		if (!event.latLng) return

		const endPoint: LatLng = {
			lat: event.latLng.lat(),
			lng: event.latLng.lng(),
		}

		setShots(prev => {
			const updated = [...prev]
			updated[updated.length - 1].end = endPoint
			return [...updated, { start: endPoint, end: null }]
		})

		setCurrentShot(prev => prev + 1)
	}

	const handleReset = () => {
		setShots([{ start: whiteTee, end: null }])
		setCurrentShot(1)
	}

	return (
		<div className="flex h-screen flex-col">
			<div className="bg-gray-100 p-4 shadow-md">
				<h2 className="text-lg font-semibold text-gray-800">
					Shot Tracker — Shot {currentShot}
				</h2>
				<button
					onClick={handleReset}
					className="mt-2 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
				>
					Reset Hole
				</button>
			</div>

			<div className="flex-1">
				<LoadScript googleMapsApiKey="YOUR_API_KEY">
					<GoogleMap
						mapContainerStyle={mapContainerStyle}
						center={center}
						zoom={18}
						mapTypeId="satellite"
						onClick={handleMapClick}
					>
						{shots.map((shot, index) => (
							<React.Fragment key={index}>
								<Marker
									position={shot.start}
									label={{
										text: `Shot ${index + 1}`,
										color: 'white',
										fontWeight: 'bold',
									}}
								/>
								{shot.end && (
									<>
										<Marker
											position={shot.end}
											icon={{
												path: google.maps.SymbolPath.CIRCLE,
												scale: 6,
												fillColor: '#00f',
												fillOpacity: 1,
												strokeWeight: 1,
											}}
										/>
										<Polyline
											path={[shot.start, shot.end]}
											options={{
												strokeColor: '#FF0000',
												strokeOpacity: 1.0,
												strokeWeight: 2,
											}}
										/>
									</>
								)}
							</React.Fragment>
						))}
					</GoogleMap>
				</LoadScript>
			</div>
		</div>
	)
}

export default ShotTracker
