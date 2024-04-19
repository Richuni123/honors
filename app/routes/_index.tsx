import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => [{ title: 'Epic News' }]

export default function Index() {
	return (
		<main className="grid h-full place-items-center">
			<h1 className="text-mega">
				Hello from{' '}
				<pre className="prose rounded-lg bg-primary p-6 text-primary-foreground">
					app/routes/_index.tsx
				</pre>
			</h1>
		</main>
	)
}
