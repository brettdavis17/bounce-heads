export interface TrampolinePark {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string | number;
    metroArea: string;
    citySection?: string; // For large metros like "Manhattan", "Brooklyn", etc.
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  hours: {
    [key: string]: string; // day of week -> hours (e.g., "monday": "10:00 AM - 9:00 PM")
  };
  amenities: string[];
  pricing: {
    general?: string;
    birthday?: string;
    group?: string;
  };
  images: string[];
  googlePhotos?: {
    photoReference: string;
    attributions: string[];
  }[];
  rating?: number;
  reviewCount?: number;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  features: string[]; // e.g., ["dodgeball", "foam pit", "ninja course"]
  ageGroups: string[]; // e.g., ["toddlers", "kids", "teens", "adults"]
  slug: string; // URL-friendly version of name
  lastUpdated: string;
}