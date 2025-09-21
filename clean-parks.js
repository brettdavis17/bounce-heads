#!/usr/bin/env node

const fs = require('fs');

console.log('Creating a clean texas-parks.ts file with valid park data...');

// Create a completely new file with just the valid park data
const cleanParks = `import { TrampolinePark } from '../types/park';

export const texasParks: TrampolinePark[] = [
  {
    "id": "ChIJ1WOAkGQ_NoYRLsd0UKwg3ZU",
    "name": "Air U Trampoline Park (Purchased by Gym U)",
    "description": "Trampoline park located in Longview, Texas.",
    "address": {
      "street": "4300 US-259",
      "city": "Longview",
      "state": "Texas",
      "zipCode": "75605",
      "metroArea": "Longview Area",
      "coordinates": {
        "lat": 32.5709525,
        "lng": -94.7336406
      }
    },
    "contact": {
      "phone": "(903) 663-4386",
      "website": "https://www.facebook.com/longviewairupark/",
      "email": ""
    },
    "hours": {
      "monday": "10:00 AM – 9:00 PM",
      "tuesday": "10:00 AM – 9:00 PM",
      "wednesday": "10:00 AM – 9:00 PM",
      "thursday": "10:00 AM – 9:00 PM",
      "friday": "10:00 AM – 10:00 PM",
      "saturday": "10:00 AM – 10:00 PM",
      "sunday": "12:00 – 8:00 PM"
    },
    "amenities": [],
    "pricing": {},
    "images": [
      "https://maps.googleapis.com/maps/api/place/photo?photoreference=ATKogpdOjHYo34Z_q_wG3bnJKfJLfKHLRFU0A4wqhzZQ3hQKQJJOb5K5MzJeOAhbBHGWHCcF2FZY5zMHlwXmfJn8rq2Hs1KqJNpfq0QvhSKjJ5JaF9EGaNOZRKxJlFWKhZxdV6PmQoYlN6qH5yGKKNjrGFqJLKNa7HGrqLR8Y2IQqJhz-2g-Zw&maxwidth=800&key=AIzaSyCyjZvaGjF_IwUY8qT75iKQpMXWU3_0Crk"
    ],
    "rating": 4.1,
    "reviewCount": 157,
    "features": [],
    "ageGroups": [
      "kids",
      "teens",
      "adults"
    ],
    "slug": "air-u-trampoline-park-longview",
    "lastUpdated": "2025-09-13"
  }
];
`;

// Write the clean file
fs.writeFileSync('./src/data/texas-parks.ts', cleanParks);
console.log('Created clean texas-parks.ts with 1 sample park');
console.log('The file is now in a clean state and ready for you to add back the parks you want');