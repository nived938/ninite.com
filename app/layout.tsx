import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Ninite - Install or Update Multiple Apps at Once',
  description: 'Pick your Windows apps and build one simple installer. No toolbars, no unnecessary clicks.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="siteShell">
          <header className="topbar">
            <div className="container nav">
              <Link href="/" className="brand" aria-label="Ninite home">
                <img src="/icon.svg" alt="" className="brandIcon" />
                <span>Ninite</span>
              </Link>
              <nav className="links" aria-label="Primary navigation">
                <Link href="/help">Help</Link>
                <a href="mailto:feedback@example.com">Feedback</a>
                <Link href="/pro" className="proLink">Ninite Pro <span>FREE</span></Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className="footer">
            <div className="container footergrid">
              <div>
                <div className="brand"><img src="/icon.svg" alt="" className="brandIcon" />Ninite</div>
                <p>Install trusted Windows apps without the usual setup hassle.</p>
              </div>
              <div>
                <h4>Explore</h4>
                <Link href="/">Choose apps</Link>
                <Link href="/apps">Full app list</Link>
                <Link href="/pro">Ninite Pro</Link>
              </div>
              <div>
                <h4>Help</h4>
                <Link href="/help">Help center</Link>
                <a href="mailto:feedback@example.com">Feedback</a>
              </div>
              <div>
                <h4>About</h4>
                <Link href="/about">About Ninite</Link>
                <span className="footerNote">No sign in required</span>
                <span className="footerNote">Pro features are free</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
