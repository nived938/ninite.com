import { db } from '@/lib/db'
import { ensureCatalog } from '@/lib/catalog'
import AppsBrowser from '@/components/AppsBrowser'
import Link from 'next/link'

export default async function Home() {
  await ensureCatalog()

  const [apps, categories, count] = await Promise.all([
    db.application.findMany({
      where: { active: true },
      include: { publisher: true, versions: { where: { current: true }, take: 1 }, categories: { include: { category: true } } },
      orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
    db.application.count({ where: { active: true } }),
  ])

  const categoryCount = categories.filter(category => apps.some(app => app.categories.some(item => item.category.slug === category.slug))).length

  return (
    <main>
      <section className="homepage-introduction">
        <div className="container introGrid">
          <div className="introMain">
            <div className="eyebrow">Simple Windows software installation</div>
            <h1>Install and Update All Your Programs at Once</h1>
            <p className="introLead">No toolbars. No hunting for installers. No clicking through endless setup screens. Just pick your apps and build one clean installer.</p>
            <div className="heroActions">
              <a className="btn primary" href="#apps">Pick your apps ↓</a>
              <Link className="btn ghost" href="/pro">Ninite Pro, free</Link>
            </div>
            <div className="trustLine"><span>✓ No account required</span><span>✓ Official publisher sources</span><span>✓ Free Pro features</span></div>
          </div>

          <div className="introColumn">
            <h2>Always Up-to-date</h2>
            <p>You don't have to keep checking software websites. The catalog is organized so you can quickly find the apps you need.</p>
            <Link href="/apps" className="textLink">Browse all {count} apps →</Link>
          </div>

          <div className="introColumn">
            <h2>Easy to navigate</h2>
            <p>{categoryCount} categories make it simple to find browsers, messaging, media, office, developer tools, AI tools and more.</p>
            <Link href="#apps" className="textLink">Start choosing →</Link>
          </div>
        </div>
      </section>

      <section className="selectorSection" id="apps">
        <div className="container">
          <div className="stepHeading">
            <span className="stepNumber">1</span>
            <div>
              <h2>Pick the apps you want</h2>
              <p>Search, choose a category, tick the apps you need, then continue to the installer builder.</p>
            </div>
          </div>
          <AppsBrowser apps={apps} categories={categories} />
        </div>
      </section>

      <section className="featureStrip">
        <div className="container featureGrid">
          <div><strong>One installer</strong><span>Combine multiple apps into a single setup flow.</span></div>
          <div><strong>No account</strong><span>Use the app picker without creating a profile.</span></div>
          <div><strong>Free Pro</strong><span>The Pro experience is available at no cost.</span></div>
        </div>
      </section>
    </main>
  )
}
