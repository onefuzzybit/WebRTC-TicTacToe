import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'stretch',
				alignItems: 'stretch',
				aspectRatio: '1/1',
				height: '100%',
				boxSizing: 'border-box',
				padding: '5%',
				margin: 'auto',
			}}
		>
			<div style={{ flex: 1 }}>{children}</div>
		</div>
	)
}
