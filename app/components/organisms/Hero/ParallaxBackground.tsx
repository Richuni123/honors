import { Parallax, useParallaxController } from 'react-scroll-parallax'
import heroImage from '~/assets/png/hero_image.png'

interface ParallaxBackgroundProps {
	description?: string
	title?: string
	image?: string
	logo?: string
	altText?: string
	children?: React.ReactNode
}

const ParallaxBackground = ({
	description,
	title,
	image = heroImage,
	logo,
	altText = 'Shoot Your Best Score - Golf Parallax Background',
	children,
}: ParallaxBackgroundProps) => {
	const parallaxController = useParallaxController()
	const handleLoad = () => parallaxController?.update()

	return (
		<div className="relative h-screen w-full">
			<div className="relative h-full w-full shadow-xl sm:overflow-hidden">
				{/* ✅ Background Image */}
				<div className="absolute inset-0 h-full w-full">
					<Parallax className="hidden lg:block" speed={-10}>
						<img
							className="h-full w-full object-cover object-center"
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

				{/* ✅ Content Layer */}
				<div className="relative z-10 flex h-full flex-col justify-between px-4 py-12 sm:px-6 lg:px-8">
					{/* Title at the top */}
					<div className="pt-8">
						<h1 className="text-center text-6xl font-extrabold tracking-tight drop-shadow-[0_0_2px_white] sm:text-8xl lg:text-9xl">
							<span className="via-secondary-dark block bg-gradient-to-r from-secondary to-secondary bg-clip-text uppercase text-transparent drop-shadow-md">
								{title}
							</span>
						</h1>
					</div>

					{/* Description in the middle */}
					<div className="absolute bottom-1/2 right-0 mr-12 flex flex-1 translate-y-1/2 transform items-center justify-end">
						<p className="max-w-lg text-center font-extrabold text-gray-700 drop-shadow-[0_0_2px_white] sm:max-w-3xl lg:text-5xl">
							{description}
						</p>
					</div>

					{/* Optional Logo and Children at the bottom */}
					{(logo || children) && (
						<div className="pt-8 text-center">
							{logo && (
								<div className="mx-auto mb-4 w-32">
									<img src={logo} className="drop-shadow-md" alt="Logo" />
								</div>
							)}
							{children}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ParallaxBackground
