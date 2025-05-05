import { Link, NavLink } from '@remix-run/react'
import { Button } from '#app/components/atoms/Button'
import SocialMediaButtons from '#app/components/molecules/SocialMediaButtons'
import { type FooterProps } from './FooterBasic'
import logo from '~/assets/png/logo.png'

const FooterMenuRight = ({
	companyName = 'Shoot Your Best Score',
	altText = 'Our company logo',
}: FooterProps) => {
	return (
		<footer className="dark:bg-dark-secondary bg-secondary lg:py-16">
			<div className="dark:border-dark-muted-foreground/75 container items-center justify-between border-b border-muted-foreground/75 py-8 lg:flex">
				<Link to="/" className="flex w-20 items-center justify-center lg:w-24">
					<img src={logo} alt={altText} className="h-10 w-auto" />
				</Link>

				<div className="lg:flex">
					<div className="dark:text-dark-secondary-foreground flex items-start gap-6 py-8 font-bold text-secondary-foreground lg:mr-24">
						<div>
							<NavLink to="#">Nav Label</NavLink>
						</div>
						<div>
							<NavLink to="#">Nav Label</NavLink>
						</div>
						<div>
							<NavLink to="#">Nav Label</NavLink>
						</div>
					</div>

					<div className="flex items-center gap-6">
						<div className="lg:mr-4">
							<Link to="/signup">
								<Button>Sign Up</Button>
							</Link>
						</div>
						<div>
							<Link to="/login">
								<Button variant="secondary">Log In</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="container flex items-center justify-between py-8">
				<div className="dark:text-dark-muted-foreground/75 text-xs text-muted-foreground/75">
					&copy; {companyName} | {new Date().getFullYear()}
				</div>
				<div className="flex w-20 items-center justify-center lg:w-24">
					<SocialMediaButtons />
				</div>
			</div>
		</footer>
	)
}

export default FooterMenuRight
