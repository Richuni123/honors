import {
	GoogleMap,
	LoadScript,
	Polygon,
	Marker,
	InfoWindow,
	Polyline,
} from '@react-google-maps/api'
import React, { useState } from 'react'

const mapContainerStyle = {
	width: '100%',
	height: '100vh',
}

const center = {
	lat: 49.2085,
	lng: -2.219,
}

const holePerimeter = [
	{ lat: 49.210028, lng: -2.21775 }, // 1 - Start
	{ lat: 49.209694, lng: -2.218028 }, // 2
	{ lat: 49.208944, lng: -2.218833 }, // 3
	{ lat: 49.208222, lng: -2.2195 }, // 4
	{ lat: 49.207861, lng: -2.220083 }, // 5
	{ lat: 49.207833, lng: -2.221556 }, // 6
	{ lat: 49.207778, lng: -2.222528 }, // 7
	{ lat: 49.208, lng: -2.222583 }, // 8
	{ lat: 49.208167, lng: -2.221972 }, // 9
	{ lat: 49.208222, lng: -2.221444 }, // 10
	{ lat: 49.208167, lng: -2.220778 }, // 11
	{ lat: 49.208167, lng: -2.220389 }, // 12
	{ lat: 49.20825, lng: -2.220278 }, // 13
	{ lat: 49.208417, lng: -2.22025 }, // 14
	{ lat: 49.208861, lng: -2.219389 }, // 15
	{ lat: 49.209361, lng: -2.218611 }, // 16
	{ lat: 49.209778, lng: -2.218083 }, // 17
	{ lat: 49.210056, lng: -2.217806 }, // 18 - End
]

const markers = [
	{
		lat: 49.210028,
		lng: -2.217806,
		label: 'White TEE',
		info: 'This is the starting point of the hole.',
	},
	{
		lat: 49.208,
		lng: -2.2199,
		label: 'Bunker ',
		info: 'Left 1 of 3 Distance from white tees 298 yards',
	},
	{
		lat: 49.207889,
		lng: -2.221611,
		label: 'Bunker ',
		info: 'Left 2 of 3, Distance from white tees 400 yards',
	},
	{
		lat: 49.207917,
		lng: -2.221889,
		label: 'Bunker',
		info: 'Left 3 of 3, Distance from the white tees 417 yards',
	},

	{
		lat: 49.2084,
		lng: -2.2201,
		label: 'Bunker',
		info: 'Right 1 of 3,Distance from the white tees 172 yards',
	},
	{
		lat: 49.208111,
		lng: -2.22175,
		label: 'Bunker',
		info: 'Right 2 of 3,Distance from the white tees 392 yards',
	},
	{
		lat: 49.208056,
		lng: -2.222028,
		label: 'Bunker',
		info: 'Right 3 of 3,Distance from the white tees 414 yards',
	},
	{
		lat: 49.207917,
		lng: -2.22225,
		label: 'GREEN',
		info: 'MIDDLE OF GREEN, Distance from white tees 469 yards, Distance from Yellow tees 449 yards',
	},
	// Add more markers as needed
]

const AboutUs = () => {
	const [selectedMarker, setSelectedMarker] = useState<{
		lat: number
		lng: number
		label: string
		info: string
	} | null>(null)

	const [measurementPath, setMeasurementPath] = useState<
		{ lat: number; lng: number }[]
	>([])
	const [distance, setDistance] = useState<number | null>(null)

	const handleMapClick = (event: google.maps.MapMouseEvent) => {
		if (event.latLng) {
			const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() }
			setMeasurementPath(prevPath => [...prevPath, newPoint])

			if (measurementPath.length > 0) {
				const lastPoint = measurementPath[measurementPath.length - 1]
				const newDistance = calculateDistance(lastPoint, newPoint)
				setDistance(prevDistance => (prevDistance || 0) + newDistance)
			}
		}
	}

	const calculateDistance = (
		point1: { lat: number; lng: number },
		point2: { lat: number; lng: number },
	) => {
		const R = 6371e3 // metres
		const φ1 = (point1.lat * Math.PI) / 180 // φ, λ in radians
		const φ2 = (point2.lat * Math.PI) / 180
		const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180
		const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

		const d = R * c // in metres
		return d * 1.09361
	}

	return (
		<LoadScript googleMapsApiKey="AIzaSyAg_e7_3kvXwRw6vuMVqqBeZFk11D4b5Co">
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				center={center}
				zoom={18}
				mapTypeId="satellite"
				onClick={handleMapClick}
			>
				<Polygon
					paths={holePerimeter}
					options={{
						fillColor: '',
						fillOpacity: 0.2,
						strokeColor: '#00BFFF',
						strokeWeight: 2,
						clickable: false,
						draggable: false,
						editable: false,
						geodesic: true,
					}}
				/>
				{markers.map((marker, index) => (
					<Marker
						key={index}
						position={{ lat: marker.lat, lng: marker.lng }}
						label={{
							text: marker.label,
							color: 'white',
							fontSize: '16px',
							fontWeight: 'bold',
						}}
						onClick={() => setSelectedMarker(marker)}
					/>
				))}
				{selectedMarker && (
					<InfoWindow
						position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
						onCloseClick={() => setSelectedMarker(null)}
					>
						<div style={{ color: 'black' }}>
							<h2>{selectedMarker.label}</h2>
							<ul>
								{selectedMarker.info.split(', ').map((info, index) => (
									<li key={index}>{info}</li>
								))}
							</ul>
						</div>
					</InfoWindow>
				)}
				{measurementPath.length > 1 && (
					<Polyline
						path={measurementPath}
						options={{
							strokeColor: '#FF0000',
							strokeOpacity: 1.0,
							strokeWeight: 2,
						}}
					/>
				)}
				{distance !== null && (
					<InfoWindow
						position={measurementPath[measurementPath.length - 1]}
						onCloseClick={() => {
							setMeasurementPath([])
							setDistance(null)
						}}
					>
						<div style={{ color: 'black' }}>
							<h2>Distance</h2>
							<p>{distance.toFixed(0)} Yards</p>
						</div>
					</InfoWindow>
				)}
			</GoogleMap>
		</LoadScript>
	)
}

export default AboutUs
