import { type MetaFunction } from '@remix-run/node'
import ParallaxBackground from '#app/components/organisms/Hero/ParallaxBackground.tsx'

export const meta: MetaFunction = () => [{ title: 'Epic News' }]

export default function Index() {
	return (
		<main className="grid h-full place-items-center">
			<ParallaxBackground
				title="Your Journey Begins!"
				description="Shoot Your Best Score uses advanced data and technology to help you improve your game and achieve your lowest scores."
			/>
		</main>
	)
}
