import Link from 'next/link';
import Logo from './Logo';

interface HeaderProps {
  showNavigation?: boolean;
}

export default function Header({ showNavigation = true }: HeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo variant="wordmark" size="md" />
          </div>
          {showNavigation && (
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
          )}
        </nav>
      </div>
    </header>
  );
}