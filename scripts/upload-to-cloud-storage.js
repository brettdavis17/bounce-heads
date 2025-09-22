const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Initialize Google Cloud Storage
// Make sure you have GOOGLE_APPLICATION_CREDENTIALS set to your service account key file
const storage = new Storage();

// Configuration
const BUCKET_NAME = 'bounce-heads-images';
const LOCAL_IMAGES_PATH = './public/images/parks';
const CLOUD_BASE_PATH = 'parks'; // Folder structure in the bucket

async function uploadImagesToBucket() {
  const bucket = storage.bucket(BUCKET_NAME);
  const uploadPromises = [];
  const urlMappings = {}; // Track old path -> new cloud URL mappings

  console.log(`Starting upload to bucket: ${BUCKET_NAME}`);
  console.log(`Scanning local images at: ${LOCAL_IMAGES_PATH}`);

  // Recursively find all image files
  function findImages(dir) {
    const files = fs.readdirSync(dir);
    const images = [];

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        images.push(...findImages(fullPath));
      } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
        images.push(fullPath);
      }
    }

    return images;
  }

  const imageFiles = findImages(LOCAL_IMAGES_PATH);
  console.log(`Found ${imageFiles.length} images to upload`);

  for (const imagePath of imageFiles) {
    // Convert local path to cloud path
    const relativePath = path.relative('./public', imagePath);
    const cloudPath = relativePath.replace(/\\/g, '/'); // Normalize path separators

    // Generate the old URL (what's currently in the database)
    const oldUrl = `/${relativePath.replace(/\\/g, '/')}`;

    // Generate the new Cloud Storage URL
    const newUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${cloudPath}`;

    urlMappings[oldUrl] = newUrl;

    // Create upload promise
    const uploadPromise = bucket.upload(imagePath, {
      destination: cloudPath,
      metadata: {
        cacheControl: 'public, max-age=31536000', // 1 year cache
        contentType: getContentType(imagePath)
      },
      public: true // Make the file publicly accessible
    }).then(() => {
      console.log(`✓ Uploaded: ${cloudPath}`);
    }).catch((error) => {
      console.error(`✗ Failed to upload ${cloudPath}:`, error.message);
    });

    uploadPromises.push(uploadPromise);

    // Upload in batches to avoid overwhelming the API
    if (uploadPromises.length >= 10) {
      await Promise.all(uploadPromises);
      uploadPromises.length = 0; // Clear the array
      console.log(`Uploaded batch, continuing...`);
    }
  }

  // Upload remaining files
  if (uploadPromises.length > 0) {
    await Promise.all(uploadPromises);
  }

  // Save URL mappings for database update
  fs.writeFileSync('./url-mappings.json', JSON.stringify(urlMappings, null, 2));
  console.log('\n✅ Upload complete!');
  console.log(`📁 URL mappings saved to: ./url-mappings.json`);
  console.log(`🔗 ${Object.keys(urlMappings).length} URLs ready for database update`);

  return urlMappings;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return contentTypes[ext] || 'application/octet-stream';
}

// Run the upload
if (require.main === module) {
  uploadImagesToBucket()
    .then(() => {
      console.log('\n🎉 All images uploaded successfully!');
      console.log('\nNext steps:');
      console.log('1. Run the database update script');
      console.log('2. Test image loading from Cloud Storage');
      console.log('3. Remove local images from repository');
    })
    .catch((error) => {
      console.error('❌ Upload failed:', error);
      process.exit(1);
    });
}

module.exports = { uploadImagesToBucket };