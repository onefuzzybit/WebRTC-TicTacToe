import { ReactNode, useEffect, useState } from 'react'

export function useSmallerSide() {
	const getSmallerSide = () => (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight)
	const [side, setSide] = useState(getSmallerSide())

	useEffect(() => {
		const update = () => setSide(getSmallerSide())

		window.addEventListener('resize', update)

		return () => window.removeEventListener('resize', update)
	}, [])

	return side
}

export function Layout({ children }: { children: ReactNode }) {
	const smallerSide = useSmallerSide()

	const padding = smallerSide < 500 ? '50px' : '5%'

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'stretch',
				alignItems: 'stretch',
				aspectRatio: '1/1',
				width: smallerSide,
				boxSizing: 'border-box',
				padding,
				margin: 'auto',
			}}
		>
			<div style={{ flex: 1 }}>{children}</div>
		</div>
	)
}
