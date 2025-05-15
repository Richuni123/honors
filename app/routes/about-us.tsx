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

const whiteTee = { lat: 49.210028, lng: -2.217806 }

const holePerimeter = [
	{ lat: 49.210028, lng: -2.21775 },
	{ lat: 49.209694, lng: -2.218028 },
	{ lat: 49.208944, lng: -2.218833 },
	{ lat: 49.208222, lng: -2.2195 },
	{ lat: 49.207861, lng: -2.220083 },
	{ lat: 49.207833, lng: -2.221556 },
	{ lat: 49.207778, lng: -2.222528 },
	{ lat: 49.208, lng: -2.222583 },
	{ lat: 49.208167, lng: -2.221972 },
	{ lat: 49.208222, lng: -2.221444 },
	{ lat: 49.208167, lng: -2.220778 },
	{ lat: 49.208167, lng: -2.220389 },
	{ lat: 49.20825, lng: -2.220278 },
	{ lat: 49.208417, lng: -2.22025 },
	{ lat: 49.208861, lng: -2.219389 },
	{ lat: 49.209361, lng: -2.218611 },
	{ lat: 49.209778, lng: -2.218083 },
	{ lat: 49.210056, lng: -2.217806 },
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
		label: 'Bunker',
		info: 'Left 1 of 3, Distance from white tees 298 yards',
	},
	{
		lat: 49.207889,
		lng: -2.221611,
		label: 'Bunker',
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
		info: 'Right 1 of 3, Distance from the white tees 172 yards',
	},
	{
		lat: 49.208111,
		lng: -2.22175,
		label: 'Bunker',
		info: 'Right 2 of 3, Distance from the white tees 392 yards',
	},
	{
		lat: 49.208056,
		lng: -2.222028,
		label: 'Bunker',
		info: 'Right 3 of 3, Distance from the white tees 414 yards',
	},
	{
		lat: 49.207917,
		lng: -2.22225,
		label: 'GREEN',
		info: 'MIDDLE OF GREEN, Distance from white tees 469 yards',
	},
]

const AboutUs = () => {
	const [selectedMarker, setSelectedMarker] = useState<any>(null)
	const [selectedShot, setSelectedShot] = useState<string>('Shot 1')
	const [shots, setShots] = useState<any[]>([])
	const [measurementPath, setMeasurementPath] = useState<any[]>([])
	const [distance, setDistance] = useState<number | null>(null)
	const [shotSelectionActive, setShotSelectionActive] = useState<boolean>(false)
	const [holeFinished, setHoleFinished] = useState<boolean>(false) // To track hole finish
	const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false) // Show confirm modal when shot is added
	const [pendingShot, setPendingShot] = useState<{
		shotIndex: number
		start: { lat: number; lng: number }
		end: { lat: number; lng: number }
	} | null>(null)

	// Handle Reset Button Click
	const handleReset = () => {
		setShots([])
		setMeasurementPath([])
		setDistance(null)
		setHoleFinished(false)
		setShotSelectionActive(false)
		setSelectedShot('Shot 1')
	}

	const handleMapClick = (event: google.maps.MapMouseEvent) => {
		if (!event.latLng) return

		const clickedPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() }

		// Prevent adding new shots after hole is finished
		if (holeFinished) {
			alert("The hole is finished. You can't add new shots.")
			return // Stop the function if the hole is finished
		}

		if (shotSelectionActive) {
			const shotIndex = parseInt(selectedShot.split(' ')[1], 10) - 1

			const maxFinishedShotIndex = shots.findIndex(shot => shot?.finished)
			const isTryingToAddNewShotAfterFinish =
				holeFinished && shotIndex > maxFinishedShotIndex

			if (isTryingToAddNewShotAfterFinish) {
				alert("The hole is finished. You can't add new shots.")
				return
			}

			const startPoint =
				shotIndex === 0 ? whiteTee : shots[shotIndex - 1]?.end || whiteTee

			// Show confirmation modal
			setPendingShot({
				shotIndex,
				start: startPoint,
				end: clickedPoint,
			})
			setShowConfirmModal(true)
		} else {
			// Measurement logic remains unchanged
			setMeasurementPath(prevPath => [...prevPath, clickedPoint])

			if (measurementPath.length > 0) {
				const lastPoint = measurementPath[measurementPath.length - 1]
				const newDistance = calculateDistance(lastPoint, clickedPoint)
				setDistance(prev => (prev || 0) + newDistance)
			}
		}
	}

	const calculateDistance = (
		point1: { lat: number; lng: number },
		point2: { lat: number; lng: number },
	) => {
		const R = 6371e3 // meters
		const φ1 = (point1.lat * Math.PI) / 180
		const φ2 = (point2.lat * Math.PI) / 180
		const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180
		const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

		const d = R * c // meters
		return d * 1.09361 // Convert to yards
	}

	const handleConfirmFinishHole = () => {
		if (pendingShot) {
			setShots(prevShots => {
				const updatedShots = [...prevShots]
				updatedShots[pendingShot.shotIndex] = {
					start: pendingShot.start,
					end: pendingShot.end,
					finished: true,
				}
				return updatedShots
			})

			setHoleFinished(true)
			setPendingShot(null)
			setShowConfirmModal(false)
			alert('Congratulations! Hole is finished.')
		}
	}

	const handleCancelFinishHole = () => {
		if (pendingShot) {
			setShots(prevShots => {
				const updatedShots = [...prevShots]
				updatedShots[pendingShot.shotIndex] = {
					start: pendingShot.start,
					end: pendingShot.end,
					finished: false,
				}
				return updatedShots
			})
			setPendingShot(null)
			setShowConfirmModal(false)
		}
	}

	return (
		<>
			{/* Modal for confirming if hole is finished */}
			{showConfirmModal && pendingShot && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-80 rounded-lg bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-xl font-semibold">Finish the Hole?</h2>
						<p className="mb-6 text-gray-700">
							Did this shot finish the hole (ball in hole)?
						</p>
						<div className="flex justify-end space-x-4">
							<button
								onClick={handleConfirmFinishHole}
								className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
							>
								HOLE FINISHED
							</button>
							<button
								onClick={handleCancelFinishHole}
								className="rounded bg-red-500 px-4 py-2 hover:bg-gray-300"
							>
								NEXT SHOT
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Shot Selection Controls */}
			<div className="bg-navy mt-4 flex flex-grow items-center justify-center space-x-6 rounded-lg p-4">
				{/* Shot Mode Toggle */}
				<button
					onClick={() => setShotSelectionActive(!shotSelectionActive)}
					className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 font-bold text-black transition hover:bg-gray-300"
				>
					<span className="text-4xl">{shotSelectionActive ? '✔' : '⛳'}</span>
				</button>

				{/* Left Arrow Button */}
				<button
					onClick={() =>
						setSelectedShot(prev => {
							const currentIndex = parseInt(prev.split(' ')[1], 10)
							return currentIndex > 1 ? `Shot ${currentIndex - 1}` : prev
						})
					}
					disabled={
						holeFinished || parseInt(selectedShot.split(' ')[1], 10) === 1
					}
					className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 font-bold text-black transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					<span className="text-4xl">←</span>
				</button>

				{/* Shot Number */}
				<span className="text-4xl font-bold text-white">{selectedShot}</span>

				{/* Right Arrow Button */}
				<button
					onClick={() =>
						setSelectedShot(prev => {
							const currentIndex = parseInt(prev.split(' ')[1], 10)
							return currentIndex < 10 ? `Shot ${currentIndex + 1}` : prev
						})
					}
					disabled={
						holeFinished || parseInt(selectedShot.split(' ')[1], 10) === 10
					}
					className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 font-bold text-black transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					<span className="text-4xl">→</span>
				</button>

				{/* Reset Button */}
				<button
					onClick={handleReset}
					className="ml-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-white transition hover:bg-red-600"
				>
					<span className="text-3xl">↩️</span> {/* Reset Icon */}
				</button>
			</div>

			{/* Google Map */}
			<LoadScript googleMapsApiKey="AIzaSyAg_e7_3kvXwRw6vuMVqqBeZFk11D4b5Co">
				<GoogleMap
					mapContainerStyle={mapContainerStyle}
					center={center}
					zoom={18}
					mapTypeId="satellite"
					onClick={handleMapClick}
				>
					{/* Hole Perimeter Polygon */}
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

					{/* Markers */}
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
							onClick={() => setSelectedMarker(marker)} // Set selected marker on click
						/>
					))}

					{/* Shot Polylines */}
					{shots.map((shot, index) => (
						<React.Fragment key={index}>
							<Polyline
								path={[shot.start, shot.end]}
								options={{
									strokeColor: shot.finished ? '#00FF00' : '#FF0000',
									strokeOpacity: 1.0,
									strokeWeight: 2,
								}}
							/>
							<Marker
								position={shot.end}
								label={{
									text: `${index + 1}`,
									color: 'black',
									fontSize: '16px',
									fontWeight: 'bold',
								}}
								icon={{
									path: google.maps.SymbolPath.CIRCLE,
									scale: 0,
								}}
							/>
						</React.Fragment>
					))}

					{/* InfoWindow for Selected Marker */}
					{selectedMarker && (
						<InfoWindow
							position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
							onCloseClick={() => setSelectedMarker(null)}
						>
							<div style={{ color: 'black' }}>
								<h2>{selectedMarker.label}</h2>
								<ul>
									{selectedMarker.info
										.split(', ')
										.map((info: string, index: number) => (
											<li key={index}>{info}</li>
										))}
								</ul>
							</div>
						</InfoWindow>
					)}

					{/* Measurement Path */}
					{measurementPath.length > 1 && (
						<Polyline
							path={measurementPath}
							options={{
								strokeColor: '#00FF00',
								strokeOpacity: 1.0,
								strokeWeight: 2,
							}}
						/>
					)}

					{/* Distance Info */}
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
		</>
	)
}

export default AboutUs
