# Google Cloud Storage Migration Guide

This guide walks you through migrating your trampoline park images from local storage to Google Cloud Storage.

## Prerequisites

1. ✅ Google Cloud Storage bucket created
2. ✅ Service account with Storage Admin permissions
3. ✅ Service account key downloaded

## Step 1: Set Up Authentication

1. **Download your service account key** from Google Cloud Console
2. **Set environment variable**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
   ```
   Or add to your `.env.local`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
   ```

## Step 2: Configure Upload Script

1. **Edit `scripts/upload-to-cloud-storage.js`**
2. **Replace `YOUR_BUCKET_NAME`** with your actual bucket name
3. **Verify paths** match your setup

## Step 3: Upload Images

```bash
# Run the upload script
node scripts/upload-to-cloud-storage.js
```

This will:
- Upload all 435 images to your bucket
- Maintain folder structure (`parks/park-name/1.jpg`)
- Generate `url-mappings.json` for database updates
- Set appropriate cache headers and public access

## Step 4: Update Database

```bash
# Update database with new Cloud Storage URLs
node scripts/update-database-urls.js
```

This will:
- Read the URL mappings from Step 3
- Update all park records in your database
- Replace local paths with Cloud Storage URLs

## Step 5: Update Next.js Configuration

Add your Cloud Storage domain to `next.config.js`:

```javascript
images: {
  remotePatterns: [
    // ... existing patterns
    {
      protocol: 'https',
      hostname: 'storage.googleapis.com',
      port: '',
      pathname: '/bounce-heads-images/**',
    },
  ],
},
```

## Step 6: Test and Clean Up

1. **Test your website** - verify images load from Cloud Storage
2. **Remove local images** (after confirming everything works):
   ```bash
   rm -rf public/images/parks
   git add . && git commit -m "Remove local images, now using Cloud Storage"
   ```

## Troubleshooting

### Authentication Issues
- Verify `GOOGLE_APPLICATION_CREDENTIALS` points to correct file
- Ensure service account has `Storage Object Admin` role

### Upload Failures
- Check bucket name is correct
- Verify bucket exists and is accessible
- Ensure sufficient quota/billing enabled

### Image Loading Issues
- Verify bucket is publicly readable
- Check CORS configuration
- Confirm URLs in database are correct

## Benefits After Migration

- 🚀 **Faster deployments** (no large image files in git)
- 💰 **Lower costs** (~$0.01/month vs API calls)
- 🌍 **Global CDN** automatic distribution
- 📈 **Better performance** with Google's infrastructure
- 🔧 **Easier scaling** when adding more parks

## Cost Estimate

- **Storage**: ~500MB = $0.01/month
- **Bandwidth**: $0.12/GB served (first 1GB free monthly)
- **Operations**: Negligible for read-only access

Total estimated cost: **< $1/month** for typical usage