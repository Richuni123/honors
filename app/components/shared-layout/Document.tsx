import {
	Links,
	LiveReload,
	Meta,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import { ClientHintCheck } from '~/utils/client-hints'
import { Theme } from '~/utils/theme.server'

interface DocumentProps {
	children: React.ReactNode
	nonce: string
	theme?: Theme
	env?: Record<string, string>
}

export default function Document({
	children,
	nonce,
	theme = 'dark',
	env = {},
}: DocumentProps) {
	return (
		<html lang="en" className={`${theme} h-full overflow-x-hidden`}>
			<head>
				<ClientHintCheck nonce={nonce} />
				<Meta />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Links />
			</head>
			<body className="bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground">
				{children}
				<script
					nonce={nonce}
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<ScrollRestoration nonce={nonce} />
				<Scripts nonce={nonce} />
				<LiveReload nonce={nonce} />
			</body>
		</html>
	)
}
