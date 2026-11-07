import { YoutubeManager } from '../components/dashboard/YoutubeManager'
import { TourDatesManager } from '../components/dashboard/TourDatesManager'
import { GalleryManager } from '../components/dashboard/GalleryManager'
import { MerchManager } from '../components/dashboard/MerchManager'
import { Tabs } from '../components/ui/Tabs'
import { PageHeader } from '../components/ui/PageHeader'

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 lg:px-10">
      <PageHeader
        title="Your content"
        description="Manage the videos, tour dates, and gallery shown on your public artist page."
      />

      <Tabs
        tabs={[
          { id: 'tour-dates', label: 'Tour dates', content: <TourDatesManager /> },
          { id: 'videos', label: 'Videos', content: <YoutubeManager /> },
          { id: 'gallery', label: 'Gallery', content: <GalleryManager /> },
          { id: 'merch', label: 'Merch', content: <MerchManager /> },
        ]}
      />
    </div>
  )
}
