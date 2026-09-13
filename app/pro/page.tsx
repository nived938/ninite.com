import Link from 'next/link'

const features = [
  ['Batch installation', 'Select as many apps as you need and send the whole selection to one installer flow.'],
  ['Update friendly', 'Rebuild your setup whenever you need a fresh, up-to-date selection of software.'],
  ['Official sources', 'Each catalog entry points to the publisher website used for release information and downloads.'],
  ['No account required', 'The free Pro experience does not require sign in, subscriptions, or a profile.'],
  ['Windows focused', 'The catalog and installer workflow are designed around everyday Windows software.'],
  ['Simple for teams', 'Use the same app selection workflow for repeatable workstation setup and maintenance.'],
]

export default function ProPage() {
  return (
    <main className="proPage">
      <section className="proHero">
        <div className="container proHeroInner">
          <div className="proBadge">NINITE PRO · FREE</div>
          <h1>Ninite Pro, now free for everyone.</h1>
          <p>Get the Pro-style workflow without a subscription. Browse the catalog, select multiple apps, build installers, and keep your Windows setup easy to repeat.</p>
          <div className="heroActions">
            <Link className="btn primary" href="/#apps">Choose apps</Link>
            <Link className="btn ghost" href="/apps">Browse the catalog</Link>
          </div>
          <p className="proFine">No payment. No sign in. No trial countdown.</p>
        </div>
      </section>

      <section className="section proFeatures">
        <div className="container">
          <div className="proSectionHeading">
            <div className="eyebrow">Everything included</div>
            <h2>One simple workflow, with the Pro tools unlocked.</h2>
            <p>Designed to stay useful without turning software setup into a complicated account or billing experience.</p>
          </div>
          <div className="proFeatureGrid">
            {features.map(([title, description]) => (
              <article className="proCard" key={title}>
                <div className="proCheck">✓</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="proCallout">
        <div className="container proCalloutInner">
          <div>
            <strong>Ready to set up a PC?</strong>
            <p>Pick your apps and continue straight into the installer builder.</p>
          </div>
          <Link className="btn primary" href="/#apps">Start installing</Link>
        </div>
      </section>
    </main>
  )
}
