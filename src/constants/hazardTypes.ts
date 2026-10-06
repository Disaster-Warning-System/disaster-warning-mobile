export const HAZARD_TYPES = [
  'Flood',
  'Landslide',
  'Cyclone',
  'Fire',
  'Earthquake',
  'Other',
] as const;

export type HazardType = (typeof HAZARD_TYPES)[number];