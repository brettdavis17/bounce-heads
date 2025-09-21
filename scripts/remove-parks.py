#!/usr/bin/env python3

import re
import sys

# IDs to remove
parks_to_remove = [
    'ChIJoxvjXzQ_NoYR7hH3JDwi17s',  # Arcade in Longview
    'ChIJXV_VgYYjNoYRnjt_Ewj5-gM'   # Skydive East Texas in Gladewater
]

def remove_parks_from_file(file_path):
    print(f"🧹 Starting removal of problematic parks from {file_path}...")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        parks_removed = 0

        for park_id in parks_to_remove:
            # Pattern to match a complete park object starting with the ID
            pattern = r',?\s*\{\s*"id":\s*"' + re.escape(park_id) + r'".*?\},?\s*'

            # Find the park entry
            match = re.search(pattern, content, re.DOTALL)
            if match:
                park_text = match.group(0)
                # Extract park name for logging
                name_match = re.search(r'"name":\s*"([^"]+)"', park_text)
                park_name = name_match.group(1) if name_match else "Unknown"

                # Extract city for logging
                city_match = re.search(r'"city":\s*"([^"]+)"', park_text)
                park_city = city_match.group(1) if city_match else "Unknown"

                print(f"❌ Removing: {park_name} ({park_city})")

                # Remove the entry, handling comma placement properly
                if park_text.strip().startswith(','):
                    # If it starts with comma, remove including the comma
                    content = content.replace(park_text, '', 1)
                elif park_text.strip().endswith(','):
                    # If it ends with comma, remove including the comma
                    content = content.replace(park_text, '', 1)
                else:
                    # Try to remove with following comma
                    content = content.replace(park_text + ',', '', 1)
                    if content == original_content:  # If that didn't work, try preceding comma
                        content = content.replace(',' + park_text, '', 1)
                        if content == original_content:  # If that didn't work either, just remove the entry
                            content = content.replace(park_text, '', 1)

                parks_removed += 1
            else:
                print(f"⚠️  Park with ID {park_id} not found")

        # Clean up any double commas that might have been created
        content = re.sub(r',\s*,', ',', content)

        # Write the updated content back to the file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✅ Successfully removed {parks_removed} parks from the database!")
        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    file_path = "src/data/texas-parks.ts"
    success = remove_parks_from_file(file_path)
    sys.exit(0 if success else 1)