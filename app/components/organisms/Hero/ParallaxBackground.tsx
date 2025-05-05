import { Parallax, useParallaxController } from 'react-scroll-parallax'
import heroImage from '~/assets/png/hero_image.png' // ✅ Your correct import path

interface ParallaxBackgroundProps {
	description?: string
	title?: string
	image?: string // Optional override
	logo?: string
	altText?: string
	children?: React.ReactNode
}

const ParallaxBackground = ({
	description,
	title,
	image = heroImage, // ✅ Use the imported image by default
	logo,
	altText = 'Shoot Your Best Score - Golf Parallax Background',
	children,
}: ParallaxBackgroundProps) => {
	const parallaxController = useParallaxController()
	const handleLoad = () => parallaxController?.update()

	return (
		<div className="relative">
			<div
				className="relative shadow-xl sm:overflow-hidden"
				style={{ height: '100vh' }}
			>
				<div className="absolute inset-0">
					<Parallax className="hidden lg:block" speed={-10}>
						<img
							className="h-full w-full object-cover object-bottom"
							src={image}
							alt={altText}
							onLoad={handleLoad}
						/>
					</Parallax>
					<img
						className="h-full w-full object-contain lg:hidden"
						src={image}
						alt={altText}
						onLoad={handleLoad}
					/>
					<div
						className="bg-primary-light absolute inset-0 mix-blend-multiply"
						style={{ opacity: 0.1 }}
					/>
				</div>
				<div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
					{/* Title - Move it closer to the top */}
					<h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
						<span className="via-secondary-dark block bg-gradient-to-r from-secondary to-secondary bg-clip-text uppercase text-transparent drop-shadow-md">
							{title}
						</span>
					</h1>

					{/* Description - Positioned further down, near the middle */}
					<p
						className="text-secondary-light mx-auto mt-6 max-w-lg text-center text-2xl drop-shadow-md sm:max-w-3xl lg:text-5xl"
						style={{
							position: 'absolute',
							top: '50%', // This places it at the middle of the screen
							transform: 'translateY(-50%)', // Vertically centers the element
						}}
					>
						{description}
					</p>

					{logo && (
						<div className="mx-auto my-8 w-32">
							<img src={logo} className="drop-shadow-md" alt="Logo" />
						</div>
					)}
					{children}
				</div>
			</div>
		</div>
	)
}

export default ParallaxBackground
