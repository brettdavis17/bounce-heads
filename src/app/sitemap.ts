import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://trampolineparks.directory'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse-by-location`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // State pages
  const states = ['texas', 'california', 'florida', 'new-york']
  const statePages = states.map(state => ({
    url: `${baseUrl}/state/${state}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Metro area pages
  const metroAreas = [
    'texas/austin-metro',
    'texas/dallas-metro',
    'texas/houston-metro',
    'california/san-francisco-bay-area',
    'california/los-angeles-metro',
    'florida/orlando-metro',
    'florida/miami-metro',
    'new-york/new-york-city-metro'
  ]
  const metroPages = metroAreas.map(metro => ({
    url: `${baseUrl}/state/${metro}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Individual park pages - would be dynamically generated from database
  const parkSlugs = [
    'air-u-trampoline-park-purchased-by-gym-u-longview',
    'ijump-tyler-trampoline-park-tyler',
    'urban-air-trampoline-and-adventure-park-tyler'
  ]
  const parkPages = parkSlugs.map(slug => ({
    url: `${baseUrl}/park/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    ...staticPages,
    ...statePages,
    ...metroPages,
    ...parkPages,
  ]
}