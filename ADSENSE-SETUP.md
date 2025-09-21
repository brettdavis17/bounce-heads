# AdSense Setup Guide

Your trampoline parks directory is now fully configured for Google AdSense advertising. Here's what has been implemented and how to complete the setup.

## What's Been Added

### 1. AdSense Components (`/src/components/AdSense.tsx`)
- **AdSense Component**: Core component for displaying ads
- **HeaderBannerAd**: 728x90 horizontal banner ads
- **SidebarAd**: 300x250 rectangle ads for sidebars
- **ContentAd**: Responsive content ads
- **FooterAd**: Footer banner ads

### 2. Ad Placements
**Browse by Location Page:**
- Header banner ad (after navigation)
- Content ad (between state grid and info section)
- Footer ad (at bottom)

**Metro Pages (e.g., East Texas):**
- Header banner ad
- Sidebar ad (next to map)
- Content ad (between sections)
- Footer ad

**Park Pages:**
- Header banner ad
- Sidebar ad (in right column)
- Content ad (after age groups)
- Footer ad

### 3. Environment Configuration
Created `.env.example` with required variables:
```
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_HEADER_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=1234567891
NEXT_PUBLIC_ADSENSE_CONTENT_SLOT=1234567892
NEXT_PUBLIC_ADSENSE_FOOTER_SLOT=1234567893
NEXT_PUBLIC_ADSENSE_ENABLED=false
```

## Setup Instructions

### Step 1: Get AdSense Approval
1. Apply for Google AdSense at https://www.google.com/adsense/
2. Wait for approval (can take days to weeks)
3. Once approved, access your AdSense dashboard

### Step 2: Create Ad Units
In your AdSense dashboard, create 4 ad units:
1. **Header Banner**: 728x90 or responsive banner
2. **Sidebar**: 300x250 rectangle
3. **Content**: Responsive display ad
4. **Footer**: 728x90 or responsive banner

### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Replace placeholder values with your actual AdSense data:
   ```
   NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-YOUR_ACTUAL_ID
   NEXT_PUBLIC_ADSENSE_HEADER_SLOT=YOUR_HEADER_SLOT_ID
   NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT=YOUR_SIDEBAR_SLOT_ID
   NEXT_PUBLIC_ADSENSE_CONTENT_SLOT=YOUR_CONTENT_SLOT_ID
   NEXT_PUBLIC_ADSENSE_FOOTER_SLOT=YOUR_FOOTER_SLOT_ID
   ```

### Step 4: Enable Ads
For production:
- Ads automatically show when `NODE_ENV=production`

For testing in development:
- Set `NEXT_PUBLIC_ADSENSE_ENABLED=true` in `.env.local`

## Features

### Development Mode
- Shows styled placeholders instead of ads
- Displays slot IDs and ad formats for debugging
- No external ad loading in development

### Production Mode
- Loads actual Google ads
- Responsive ad sizing
- Proper error handling

### Responsive Design
- Ads adapt to different screen sizes
- Mobile-friendly layouts
- Proper spacing and integration

## Revenue Optimization

### High-Traffic Pages
Ads are strategically placed on:
- **Browse by Location**: High traffic landing page
- **Metro Pages**: Targeted local traffic
- **Park Pages**: High-intent users researching specific parks

### Ad Positioning
- **Above the fold**: Header banners for maximum visibility
- **Content integration**: Ads between content sections for engagement
- **Sidebar**: Non-intrusive sidebar ads on desktop
- **Footer**: Additional inventory without disrupting UX

## Next Steps

1. **Apply for AdSense** if you haven't already
2. **Create ad units** in your AdSense dashboard
3. **Update environment variables** with your actual IDs
4. **Monitor performance** using AdSense analytics
5. **Optimize placement** based on performance data

## Testing

To test ads in development:
1. Set `NEXT_PUBLIC_ADSENSE_ENABLED=true` in `.env.local`
2. Add your AdSense client ID and slot IDs
3. Run `npm run dev`
4. Visit pages to see ad placeholders/actual ads

## Support

- AdSense Help: https://support.google.com/adsense
- Policy Guidelines: https://support.google.com/adsense/answer/48182

Your site is now ready for AdSense monetization! 🎉