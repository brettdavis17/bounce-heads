# Mapbox Maps Setup Guide

Your trampoline parks directory now features an improved map experience using Mapbox and OpenStreetMap, inspired by the Pickleheads.com layout with a scrollable parks list on the left and interactive map on the right.

## What's Been Implemented

### 🗺️ **New Mapbox Component** (`/src/components/MapboxParksMap.tsx`)
- **Split Layout**: Scrollable parks list (left) + interactive map (right)
- **Interactive Markers**: Numbered pins that respond to clicks and hovers
- **Selection System**: Click parks in list or map markers to highlight
- **Real Roads**: Mapbox Streets style showing actual roads and landmarks
- **Responsive Design**: Works on desktop and mobile devices

### 🔄 **Replaced Google Maps**
- **Metro Pages**: Now use the new Mapbox split layout
- **Better UX**: More intuitive than the previous visual map
- **Performance**: Faster loading and smoother interactions

### 🎯 **Key Features**
- **Numbered Markers**: Each park has a numbered pin (1, 2, 3...)
- **Park Details**: Click any park to see info overlay on map
- **Navigation Controls**: Zoom, pan, and navigation controls
- **Call-to-Action**: Direct links to park details and phone numbers

## Setup Instructions

### Step 1: Get Mapbox Access Token
1. Go to https://account.mapbox.com/
2. Sign up for a free account (generous free tier: 50k map loads/month)
3. Navigate to "Access Tokens" in your dashboard
4. Copy your default public token (starts with `pk.`)

### Step 2: Configure Environment Variables
1. Add your Mapbox token to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_actual_mapbox_token_here
   ```

### Step 3: Test the Implementation
1. Restart your development server: `npm run dev`
2. Visit any metro page (e.g., http://localhost:3001/state/texas/east-texas/)
3. You should see the new split layout with parks list and map

## Features in Detail

### 🎨 **Visual Design**
- **Clean Layout**: Parks list on left, map on right (50/50 split)
- **Numbered Pins**: Custom blue pins with white numbers
- **Hover Effects**: Pins grow slightly on hover
- **Selection State**: Selected pins turn red and scale up

### 🔄 **Interactions**
- **List Clicks**: Click park in list to highlight on map
- **Map Clicks**: Click map pin to show park details
- **Info Overlay**: Selected park details appear on map
- **Cross-Highlighting**: Hover park in list highlights map pin

### 📱 **Responsive Design**
- **Desktop**: Side-by-side layout (50/50 split)
- **Mobile**: Stacked layout (list above map)
- **Scrollable List**: Parks list scrolls independently

### 🗺️ **Map Features**
- **Real Streets**: Actual road network from OpenStreetMap
- **Navigation**: Zoom, pan, rotate controls
- **Auto-Fit**: Map automatically fits to show all parks
- **Fly-To**: Clicking parks flies map to location

## Comparison to Pickleheads

### ✅ **What We Matched**
- Split layout (list + map)
- Numbered markers
- Interactive selections
- Real street maps
- Scrollable results

### 🎯 **Our Improvements**
- **Better Integration**: Seamlessly integrated with existing design
- **Park-Specific**: Tailored for trampoline parks with relevant info
- **Call Actions**: Direct phone and details buttons
- **Responsive**: Better mobile experience

## Cost Comparison

### **Mapbox vs Google Maps**
- **Mapbox Free Tier**: 50,000 map loads/month
- **Google Maps**: 28,000 map loads/month ($200 credit)
- **Pricing**: Mapbox often more affordable at scale
- **Features**: Mapbox offers more customization options

## Next Steps

### 1. **Get Your Token**
- Sign up at https://account.mapbox.com/
- Add your token to `.env.local`

### 2. **Customize Styling** (Optional)
- Modify marker colors in `MapboxParksMap.tsx`
- Adjust map style (streets, satellite, dark, etc.)
- Customize info overlay design

### 3. **Monitor Usage**
- Check Mapbox dashboard for usage statistics
- Set up billing alerts if needed
- Consider upgrading plan if you exceed free tier

## Testing Without Token

If you don't have a Mapbox token yet:
- Component shows a "Map Coming Soon" placeholder
- All other functionality works normally
- No errors or broken layouts

## Support

- **Mapbox Documentation**: https://docs.mapbox.com/
- **Mapbox Support**: https://support.mapbox.com/
- **Pricing**: https://www.mapbox.com/pricing/

Your trampoline parks directory now has a professional, interactive map experience that rivals the best location-based websites! 🗺️✨