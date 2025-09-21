import { notFound } from 'next/navigation';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {state.toUpperCase()} Trampoline Parks
        </h1>
        <p className="text-lg text-gray-600">
          State pages are being updated to use the database.
        </p>
      </div>
    </div>
  );
}