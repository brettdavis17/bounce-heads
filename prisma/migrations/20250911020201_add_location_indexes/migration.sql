-- Add indexes for location-based queries using basic lat/lng coordinates
CREATE INDEX IF NOT EXISTS trampoline_parks_latitude_idx ON trampoline_parks (latitude);
CREATE INDEX IF NOT EXISTS trampoline_parks_longitude_idx ON trampoline_parks (longitude);
CREATE INDEX IF NOT EXISTS trampoline_parks_city_idx ON trampoline_parks (city);
CREATE INDEX IF NOT EXISTS trampoline_parks_metro_area_idx ON trampoline_parks ("metroArea");