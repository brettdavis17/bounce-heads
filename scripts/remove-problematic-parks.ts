import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🧹 Starting removal of problematic parks...');

// Path to the Texas parks data file
const texasParksPath = join(process.cwd(), 'src', 'data', 'texas-parks.ts');

// IDs of parks to remove
const parksToRemove = [
  'ChIJoxvjXzQ_NoYR7hH3JDwi17s', // Arcade in Longview
  'ChIJXV_VgYYjNoYRnjt_Ewj5-gM'  // Skydive East Texas in Gladewater
];

try {
  // Read the current file
  console.log('📖 Reading Texas parks file...');
  const fileContent = readFileSync(texasParksPath, 'utf-8');

  // Parse the current parks array
  const arrayStart = fileContent.indexOf('[');
  const arrayEnd = fileContent.lastIndexOf('];') + 1;
  const beforeArray = fileContent.substring(0, arrayStart);
  const afterArray = fileContent.substring(arrayEnd + 1);
  const arrayContent = fileContent.substring(arrayStart, arrayEnd);

  // Parse as JSON
  const parksArray = JSON.parse(arrayContent);
  console.log(`📊 Found ${parksArray.length} parks total`);

  // Filter out the problematic parks
  const filteredParks = parksArray.filter((park: any) => {
    const shouldRemove = parksToRemove.includes(park.id);
    if (shouldRemove) {
      console.log(`❌ Removing: ${park.name} (${park.address.city}, ${park.address.state})`);
    }
    return !shouldRemove;
  });

  console.log(`✅ Parks after removal: ${filteredParks.length}`);
  console.log(`🗑️  Removed ${parksArray.length - filteredParks.length} parks`);

  // Convert back to string with proper formatting
  const newArrayContent = JSON.stringify(filteredParks, null, 2);

  // Reconstruct the file
  const newFileContent = beforeArray + newArrayContent + ';' + afterArray;

  // Write the updated file
  console.log('💾 Writing updated file...');
  writeFileSync(texasParksPath, newFileContent, 'utf-8');

  console.log('✅ Successfully removed problematic parks from the database!');

} catch (error) {
  console.error('❌ Error removing parks:', error);
  process.exit(1);
}