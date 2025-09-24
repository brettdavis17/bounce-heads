import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <nav className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="inline-block">
                <img
                  src="/wordmark.png"
                  alt="Trampoline Parks Directory"
                  width={300}
                  height={100}
                  className="h-16 w-auto"
                />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
              <Link
                href="/directory"
                className="btn gradient-primary text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
              >
                Find Parks Near You
              </Link>
              <Link
                href="/browse-by-location"
                className="btn border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Browse by Location
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <section className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Bounce Into Fun at America&apos;s
            <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Best Trampoline Parks
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Discover the ultimate family entertainment experience with our comprehensive guide to trampoline parks across the United States. From high-flying adventures to safe toddler zones, find the perfect bouncing destination for every age and skill level.
          </p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M9 0a9 9 0 100 18A9 9 0 009 0zM3.5 9a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Open Jump Areas</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Experience the freedom of bouncing on wall-to-wall trampolines with designated areas for different skill levels and age groups.
            </p>
          </div>

          <div className="card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Dodgeball Courts</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Take the classic game to new heights with trampoline dodgeball courts that add bouncing excitement to every throw and dodge.
            </p>
          </div>

          <div className="card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Foam Pits</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Practice your flips and tricks safely by landing in massive foam cube pits designed for aerial adventures and skill development.
            </p>
          </div>

          <div className="card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Basketball Hoops</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Slam dunk like never before with trampoline-assisted basketball courts featuring adjustable hoops for all ages and abilities.
            </p>
          </div>

          <div className="card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ninja Courses</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Challenge yourself with obstacle courses featuring balance beams, rope swings, and climbing walls combined with trampolines.
            </p>
          </div>

          <div className="card bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Toddler Areas</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Safe, designated spaces with smaller trampolines and soft play equipment designed specifically for our youngest bouncers.
            </p>
          </div>
        </section>

        <section className="card bg-white rounded-xl shadow-lg p-10 mb-20 border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Perfect for Every Occasion
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Birthday Parties</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Make birthdays unforgettable with dedicated party rooms, group rates, and professional party hosts to manage the fun.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Family Fun</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Enjoy quality family time with activities suitable for all ages, from toddlers to adults, in a safe and supervised environment.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fitness & Exercise</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Get an amazing workout while having fun. Trampolining burns calories and improves cardiovascular health naturally.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Ready to Start Bouncing?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto font-medium">
            Find trampoline parks near you with our comprehensive directory featuring locations, pricing, hours, and reviews.
          </p>
          <Link
            href="/directory"
            className="btn inline-block gradient-primary text-white px-10 py-4 rounded-xl hover:shadow-xl font-bold text-xl transform hover:scale-105 bounce-on-hover"
          >
            Browse Trampoline Parks
          </Link>
        </section>
      </main>
    </div>
  );
}
