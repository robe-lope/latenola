import './globals.css'

export const metadata = {
  title: 'LateNola — Mundial 2026',
  description: 'Tracker de figuritas Panini para el Mundial 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  )
}
