import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'

const SECTIONS = [
  { id: 'overview', label: 'How the site works' },
  { id: 'tour-dates', label: 'Tour dates' },
  { id: 'videos', label: 'Videos' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'merch', label: 'Merch' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'admin', label: 'For admins' },
  { id: 'faq', label: 'Troubleshooting' },
]

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="mb-2 font-display text-2xl text-bone">{title}</h2>
      {intro && <p className="mb-5 max-w-2xl text-sm text-fog">{intro}</p>}
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  )
}

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-fog">{title}</h3>
      <div className="flex flex-col gap-2 text-sm text-bone-dim">{children}</div>
    </div>
  )
}

function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="flex list-decimal flex-col gap-1.5 pl-5 marker:text-fog">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ol>
  )
}

function Example({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="border-l-2 border-l-accent/60 p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">Example · {title}</p>
      <div className="flex flex-col gap-2 text-sm text-bone-dim">{children}</div>
    </Card>
  )
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl bg-surface-raised px-4 py-3 text-sm text-bone-dim">
      <span className="text-bone">Good to know: </span>
      {children}
    </p>
  )
}

const code = 'rounded bg-surface-raised px-1.5 py-0.5 text-xs text-bone'

export default function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <div className="animate-fade-up mb-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-fog">Help</p>
        <h1 className="font-display text-4xl text-bone">How Ember works</h1>
        <p className="mt-2 max-w-xl text-sm text-fog">
          A step-by-step guide to every tab in your dashboard, with examples of what to type and what your fans will see.
        </p>
      </div>

      <nav className="mb-14 flex flex-wrap gap-2" aria-label="Help sections">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-hairline px-4 py-1.5 text-xs text-bone-dim transition-colors hover:border-accent/60 hover:text-bone"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <Section id="overview" title="How the site works">
        <Sub title="The big picture">
          <p>
            Ember gives every artist one public page and one private dashboard. You edit things in the dashboard; fans see the
            result on your public page. There is no "publish" button: <span className="text-bone">every change is live the moment you save it.</span>
          </p>
        </Sub>

        <Sub title="Your two pages">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-fog">
            <li>
              <span className="text-bone">Public page</span> — <code className={code}>/artists/your-slug</code>. Anyone can open it, no
              login needed. It shows your name, videos, gallery and tour dates.
            </li>
            <li>
              <span className="text-bone">Dashboard</span> — <code className={code}>/dashboard</code>. Only you can open it, after
              signing in. It has four tabs: Tour dates, Videos, Gallery and Merch.
            </li>
          </ul>
        </Sub>

        <Example title="your first 5 minutes">
          <Steps
            items={[
              'Sign in on the home page with the username and password you were given.',
              'You land on the dashboard. Open the Tour dates tab and add your next show.',
              'Open the public page (e.g. /artists/luna-vale) in another browser tab.',
              'Refresh it. Your show is there. That is the whole loop: edit, save, refresh.',
            ]}
          />
        </Example>

        <Tip>
          Accounts are created by an admin, not by you. If you can't sign in, or you need a new password, ask your admin. Use "Log
          out" in the top-right corner when you're on a shared computer.
        </Tip>

        <Sub title="Things that work the same in every tab">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-fog">
            <li>
              <span className="text-bone">+ Add …</span> at the top right opens a small form. Fields with a red message have a
              problem; fix them and press the button again.
            </li>
            <li>
              <span className="text-bone">Edit</span> reopens the same form with your current values filled in.
            </li>
            <li>
              <span className="text-bone">Delete</span> (red) removes the entry straight away, with no "are you sure?". It cannot be
              undone.
            </li>
            <li>
              <span className="text-bone">Save order</span> (Videos and Gallery) only becomes clickable once you've moved something.
            </li>
          </ul>
        </Sub>
      </Section>

      <Section
        id="tour-dates"
        title="Tour dates tab"
        intro="Your upcoming shows. Each one appears on your public page with the venue, city, date and a Tickets button."
      >
        <Sub title="Add a show">
          <Steps
            items={[
              <>Click <span className="text-bone">+ Add tour date</span>.</>,
              <><span className="text-bone">Date &amp; time</span> — pick the day and the time the show starts.</>,
              <><span className="text-bone">Venue</span> — the name of the place.</>,
              <><span className="text-bone">Location</span> — city and country.</>,
              <><span className="text-bone">Tickets URL</span> — the full link, starting with <code className={code}>https://</code>.</>,
              <>Tick <span className="text-bone">Tickets available</span> if tickets can still be bought. Untick it when the show sells out.</>,
              <>Press <span className="text-bone">Add tour date</span>.</>,
            ]}
          />
        </Sub>

        <Example title="a show in Stockholm">
          <p>
            Date &amp; time: <span className="text-bone">2026-11-14, 20:00</span>
            <br />
            Venue: <span className="text-bone">Debaser Strand</span>
            <br />
            Location: <span className="text-bone">Stockholm, Sweden</span>
            <br />
            Tickets URL: <span className="text-bone">https://tickets.example.com/luna-vale-stockholm</span>
            <br />
            Tickets available: <span className="text-bone">ticked</span>
          </p>
          <p>
            In your dashboard it reads <span className="text-bone">Debaser Strand · Stockholm, Sweden</span> with{' '}
            <span className="text-bone">Tickets on sale</span> underneath. Fans see a card with a <span className="text-bone">Tickets</span>{' '}
            button that opens your link in a new tab.
          </p>
        </Example>

        <Example title="the show sells out">
          <p>
            Click <span className="text-bone">Edit</span> on the show, untick <span className="text-bone">Tickets available</span>, and
            save. The Tickets button on your public page is replaced by the words <span className="text-bone">Sold out</span>.
          </p>
        </Example>

        <Tip>
          The Tickets URL is required even for sold-out shows, so keep the link in there. Past shows are not removed automatically;
          delete them yourself when they're over.
        </Tip>
      </Section>

      <Section
        id="videos"
        title="Videos tab"
        intro="YouTube videos shown on your public page, in the order you choose."
      >
        <Sub title="Add a video">
          <Steps
            items={[
              <>Open the video on YouTube and look at the address bar.</>,
              <>
                Copy only the 11 characters after <code className={code}>v=</code>. That is the video ID.
              </>,
              <>Click <span className="text-bone">+ Add video</span>, paste the ID, and optionally type a title.</>,
              <>Press <span className="text-bone">Add video</span>. It is added at the bottom of the list.</>,
            ]}
          />
        </Sub>

        <Example title="finding the video ID">
          <p>
            The link is <code className={code}>https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>
          </p>
          <p>
            The ID is <code className={code}>dQw4w9WgXcQ</code>. Paste only that. Pasting the whole link gives the error "Must be an
            11-character YouTube video ID".
          </p>
          <p>
            Short links work the same way: in <code className={code}>https://youtu.be/dQw4w9WgXcQ</code> the ID is the part after the
            last slash.
          </p>
        </Example>

        <Sub title="Change the order">
          <Steps
            items={[
              <>Use the <span className="text-bone">↑</span> and <span className="text-bone">↓</span> buttons next to a video to move it.</>,
              <>"Unsaved position changes" appears at the top. Nothing is changed for fans yet.</>,
              <>Press <span className="text-bone">Save order</span> to make it live.</>,
            ]}
          />
        </Sub>

        <Example title="putting your newest video first">
          <p>
            You have <span className="text-bone">1. Midnight Drive</span>, <span className="text-bone">2. Live at Strand</span>,{' '}
            <span className="text-bone">3. New Single</span>. Press ↑ twice on "New Single" and then Save order. Fans now see New
            Single first.
          </p>
        </Example>

        <Tip>
          The title is optional. Without one your dashboard shows the raw ID, and fans see the video with no caption. Use{' '}
          <span className="text-bone">Edit</span> to add or change it later.
        </Tip>
      </Section>

      <Section
        id="gallery"
        title="Gallery tab"
        intro="Photos shown as a grid on your public page. Fans can click one to view it full size."
      >
        <Sub title="Add a photo">
          <Steps
            items={[
              <>Click <span className="text-bone">+ Add photo</span>.</>,
              <>Click the dashed box and choose a file from your computer. You'll see a preview.</>,
              <>Wrong one? Press <span className="text-bone">Choose a different photo</span>.</>,
              <>Press <span className="text-bone">Upload photo</span>. It is added at the end of the gallery.</>,
            ]}
          />
        </Sub>

        <Example title="what's allowed">
          <p>
            <span className="text-bone">Works:</span> <code className={code}>stage-photo.jpg</code> (1.4 MB), a PNG poster, a WebP
            or a GIF.
          </p>
          <p>
            <span className="text-bone">Rejected:</span> a 4 MB camera original ("Must be smaller than 2MB"), a PDF or a HEIC
            iPhone photo ("Must be a JPEG, PNG, WebP, or GIF image"). Export or resize the image first, then try again.
          </p>
        </Example>

        <Sub title="Reorder or delete">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-fog">
            <li>
              <span className="text-bone">←</span> moves a photo earlier and <span className="text-bone">→</span> moves it later.
              Press <span className="text-bone">Save order</span> afterwards, just like in Videos.
            </li>
            <li>
              <span className="text-bone">✕</span> deletes the photo immediately.
            </li>
          </ul>
        </Sub>

        <Tip>The first photo in your gallery is the first one fans see. Put your best one at the start.</Tip>
      </Section>

      <Section
        id="merch"
        title="Merch tab"
        intro="The things you sell, and how many of each are in stock. The tab has two parts: your items at the top and Reservations below."
      >
        <Sub title="Two kinds of items">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-fog">
            <li>
              <span className="text-bone">Clothing</span> — stock is tracked per size (XS, S, M, L, XL, XXL). Use this for shirts and hoodies.
            </li>
            <li>
              <span className="text-bone">Misc</span> — one single stock number. Use this for posters, vinyl, stickers and so on.
            </li>
          </ul>
          <p>
            Choose carefully: <span className="text-bone">the type can't be changed after the item is created.</span> If you pick the
            wrong one, delete the item and make a new one.
          </p>
        </Sub>

        <Sub title="Add an item">
          <Steps
            items={[
              <>Click <span className="text-bone">+ Add item</span>.</>,
              <>Optional: choose a photo (JPEG, PNG, WebP or GIF, up to 2 MB).</>,
              <>Fill in Name, Description, Price in USD (for example <code className={code}>25.00</code>) and Type.</>,
              <>Press <span className="text-bone">Add item</span>. The item now exists but has <span className="text-bone">no stock yet</span>.</>,
              <>Set the stock on the item's card (see below).</>,
            ]}
          />
        </Sub>

        <Example title="a clothing item with sizes">
          <p>
            Name: <span className="text-bone">Tour Hoodie</span>, Price: <span className="text-bone">55.00</span>, Type:{' '}
            <span className="text-bone">Clothing</span>.
          </p>
          <p>
            On the card, under <span className="text-bone">Stock</span>, pick <span className="text-bone">M</span> from the size
            dropdown, enter <span className="text-bone">10</span> and press <span className="text-bone">Add size</span>. Repeat for L
            with 8. You now have two rows: M = 10 and L = 8. A size that already has a row disappears from the dropdown.
          </p>
        </Example>

        <Example title="a misc item with one stock number">
          <p>
            Name: <span className="text-bone">Signed Poster</span>, Price: <span className="text-bone">15.00</span>, Type:{' '}
            <span className="text-bone">Misc</span>. On the card, type <span className="text-bone">30</span> and press{' '}
            <span className="text-bone">Set stock</span>.
          </p>
        </Example>

        <Sub title="Changing stock">
          <p>
            Type a new number in a stock row. The <span className="text-bone">Save</span> button lights up only when the number
            differs from what's stored. Press it to apply. <span className="text-bone">Remove</span> deletes that size (or the stock
            row) entirely.
          </p>
        </Sub>

        <Sub title="Hide, edit and delete">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-fog">
            <li>
              <span className="text-bone">Hide / Show</span> — hides the item without deleting it. A hidden item shows "· Hidden" on
              its card. Useful for sold-out or seasonal items you'll bring back.
            </li>
            <li>
              <span className="text-bone">Edit</span> — change name, description, price or photo. You can also remove the photo.
            </li>
            <li>
              <span className="text-bone">Delete</span> — removes the item for good.
            </li>
          </ul>
        </Sub>
      </Section>

      <Section
        id="reservations"
        title="Reservations (in the Merch tab)"
        intro="When a fan reserves something, the request lands here with their contact details. You then contact them and arrange payment and delivery yourself."
      >
        <Sub title="What each row shows">
          <p>
            The item, the size (for clothing), the quantity, the fan's email or Instagram handle, and the date they asked. Rows are
            grouped by status, with a count next to each heading.
          </p>
        </Sub>

        <Sub title="The three statuses">
          <ul className="flex list-disc flex-col gap-1.5 pl-5 marker:text-fog">
            <li>
              <span className="text-bone">Pending</span> — a new request you haven't dealt with yet.
            </li>
            <li>
              <span className="text-bone">Contacted</span> — you've written to the fan and are waiting for them.
            </li>
            <li>
              <span className="text-bone">Fulfilled</span> — the fan has their item. Done.
            </li>
          </ul>
          <p>Change the status with the dropdown on the right of each row. The row moves to its new group right away.</p>
        </Sub>

        <Example title="one reservation from start to finish">
          <Steps
            items={[
              <>A fan reserves <span className="text-bone">Tour Hoodie · M</span>, quantity 1, with the email <span className="text-bone">sam@example.com</span>. It appears under <span className="text-bone">Pending · 1</span>.</>,
              <>You email Sam about payment. Set the dropdown to <span className="text-bone">Contacted</span>.</>,
              <>Sam pays and you hand over the hoodie. Set it to <span className="text-bone">Fulfilled</span>.</>,
            ]}
          />
        </Example>

        <Sub title="Cancelling a reservation">
          <p>
            Choose <span className="text-bone">Cancelled</span> in the dropdown. A confirmation asks whether you're sure. If you
            confirm, the reserved quantity is <span className="text-bone">added back to stock</span> and the reservation is permanently
            removed. You can't undo it and it won't appear under any status afterwards.
          </p>
        </Sub>

        <Example title="cancelling restores stock">
          <p>
            Tour Hoodie M has 10 in stock; Sam reserved 2, so it shows 8. You cancel Sam's reservation, and M goes back to 10.
          </p>
        </Example>

        <Sub title="Searching">
          <p>
            Once you have at least one reservation, a search box appears. Type part of an email or Instagram name (for example{' '}
            <code className={code}>sam</code>) and only matching reservations remain. It searches contact details only, not item names.
          </p>
        </Sub>

        <Tip>Fulfilled reservations stay in the list as a record. Only cancelling removes one.</Tip>
      </Section>

      <Section
        id="admin"
        title="For admins"
        intro="Admin accounts manage artists. They don't have a public page or a dashboard of their own."
      >
        <Sub title="The artist list">
          <p>
            After signing in you land on <span className="text-bone">All artists</span>. Use the search box to filter by name, username
            or slug, and the Sort buttons to order by display name, username or slug. Click a row, or press Enter on it, to manage
            that artist.
          </p>
        </Sub>

        <Sub title="Create an artist">
          <Steps
            items={[
              <>Click <span className="text-bone">+ New artist</span>.</>,
              <><span className="text-bone">Display name</span> — the name fans see, up to 100 characters.</>,
              <><span className="text-bone">Slug</span> — the web address. Lowercase letters, numbers and single hyphens, 3 to 50 characters.</>,
              <><span className="text-bone">Username</span> — what they sign in with, 3 to 50 characters.</>,
              <><span className="text-bone">Password</span> — at least 8 characters. Share it with the artist privately.</>,
            ]}
          />
        </Sub>

        <Example title="a new artist">
          <p>
            Display name: <span className="text-bone">Luna Vale</span>, Slug: <span className="text-bone">luna-vale</span>, Username:{' '}
            <span className="text-bone">luna</span>.
          </p>
          <p>
            Her public page is <code className={code}>/artists/luna-vale</code>. Not valid: <code className={code}>Luna Vale</code>{' '}
            (capitals, spaces) or <code className={code}>luna--vale</code> (double hyphen).
          </p>
        </Example>

        <Sub title="Editing on an artist's behalf">
          <p>
            The artist page ("Managing @luna-vale") has the same four tabs as the artist's own dashboard. Everything you change is
            saved to <span className="text-bone">that artist's</span> account. Use "← All artists" to go back.
          </p>
        </Sub>

        <Tip>The slug is part of public links, so pick it carefully before sharing the page anywhere.</Tip>
      </Section>

      <Section id="faq" title="Troubleshooting">
        <Sub title="I saved something but my public page didn't change">
          <p>Refresh the public page. If it still looks the same, check the entry in your dashboard and make sure it saved without an error.</p>
        </Sub>
        <Sub title="I moved things around but fans still see the old order">
          <p>
            Moving only changes your screen until you press <span className="text-bone">Save order</span>. If you leave the page first,
            the move is lost.
          </p>
        </Sub>
        <Sub title="My form won't submit">
          <p>Look for red text under a field. Common causes: a Tickets URL missing <code className={code}>https://</code>, a video link instead of the 11-character ID, or a slug with capitals.</p>
        </Sub>
        <Sub title="I'm sent back to the sign-in page">
          <p>Your session has ended. Sign in again and you'll be taken back to where you were.</p>
        </Sub>
        <Sub title="I opened a page that doesn't exist (404)">
          <p>
            Check the address. Public pages look like <code className={code}>/artists/your-slug</code>.{' '}
            <Link to="/" className="text-accent hover:underline">
              Back to the start
            </Link>
            .
          </p>
        </Sub>
      </Section>
    </div>
  )
}
