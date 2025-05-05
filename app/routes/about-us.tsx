import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api'

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

const AboutUs = () => {
	return (
		<LoadScript googleMapsApiKey="">
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				center={center}
				zoom={18}
				mapTypeId="satellite"
			>
				<Polygon
					paths={holePerimeter}
					options={{
						fillColor: '',
						strokeColor: '#00BFFF',
						strokeWeight: 2,
						clickable: false,
						draggable: false,
						editable: false,
						geodesic: true,
					}}
				/>
			</GoogleMap>
		</LoadScript>
	)
}

export default AboutUs
