interface SectionPageProps {
  params: Promise<{
    state: string;
    metro: string;
    section: string;
  }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { state, metro, section } = await params;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {section.replace('-', ' ')} - {metro.replace('-', ' ')} - {state.toUpperCase()}
        </h1>
        <p className="text-lg text-gray-600">
          Section pages are being updated to use the database.
        </p>
      </div>
    </div>
  );
}