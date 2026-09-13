import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'AppNest, your Windows software hub', description: 'Discover trusted Windows applications, build bundles and keep software updated.' }

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>
    <header className="topbar"><div className="container nav">
      <Link href="/" className="brand"><span className="logo">A</span>AppNest</Link>
      <nav className="links"><Link href="/apps">Apps</Link><Link href="/bundles">Bundles</Link><Link href="/updates">Updates</Link><Link href="/security">Security</Link><Link href="/dashboard">Dashboard</Link><Link href="/login" className="btn secondary always">Sign in</Link></nav>
    </div></header>
    {children}
    <footer className="footer"><div className="container footergrid"><div><div className="brand"><span className="logo">A</span>AppNest</div><p>Less searching. Less clicking. More getting things done.</p></div><div><h4>Explore</h4><Link href="/apps">Apps</Link><Link href="/bundles">Bundles</Link><Link href="/updates">Updates</Link></div><div><h4>Trust</h4><Link href="/security">Security</Link><Link href="/about">About</Link><Link href="/help">Help</Link></div><div><h4>Product</h4><Link href="/pricing">Pricing</Link><Link href="/business">Business</Link><Link href="/privacy">Privacy</Link></div></div></footer>
  </body></html>
}
