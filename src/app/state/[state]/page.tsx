import { notFound } from 'next/navigation';
import Link from 'next/link';

interface StatePageProps {
  params: Promise<{
    state: string;
  }>;
}

export async function generateMetadata({ params }: StatePageProps) {
  const { state } = await params;
  const stateDisplayName = state.charAt(0).toUpperCase() + state.slice(1).replace(/-/g, ' ');

  const title = `Trampoline Parks in ${stateDisplayName} | Complete Directory`;
  const description = `Find all trampoline parks in ${stateDisplayName}. Browse by metro area to discover indoor family fun, birthday party venues, and recreational activities near you.`;

  return {
    title,
    description,
    keywords: `${stateDisplayName} trampoline parks, family fun ${stateDisplayName}, indoor activities ${stateDisplayName}, birthday parties ${stateDisplayName}, recreational facilities ${stateDisplayName}`,
    openGraph: {
      title,
      description,
      url: `https://trampolineparks.directory/state/${state}`,
      siteName: "Trampoline Parks Directory",
      images: [
        {
          url: "https://trampolineparks.directory/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Trampoline Parks in ${stateDisplayName}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://trampolineparks.directory/twitter-image.jpg"],
    },
    alternates: {
      canonical: `https://trampolineparks.directory/state/${state}`,
    },
  };
}

export default async function StatePage({ params }: StatePageProps) {
  const { state } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="inline-block">
                <img
                  src="/wordmark.png"
                  alt="Trampoline Parks Directory"
                  width={300}
                  height={100}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
              <Link
                href="/directory"
                className="btn gradient-primary text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
              >
                Find Parks
              </Link>
              <Link
                href="/browse-by-location"
                className="btn border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Browse by Location
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {state.toUpperCase()} Trampoline Parks
          </h1>
          <p className="text-lg text-gray-600">
            State pages are being updated to use the database.
          </p>
        </div>
      </main>
    </div>
  );
}