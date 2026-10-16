import type { Shelter } from "../types/shelter";

export type ShelterSearchLocation = {
  latitude: number;
  longitude: number;
};

export type ShelterSearchResult = {
  shelter: Shelter;
  distanceKm?: number;
};

/** Apply the citizen shelter search and, when requested, rank map-located shelters by distance. */
export function getVisibleShelters(
  shelters: Shelter[],
  searchTerm: string,
  nearbyLocation: ShelterSearchLocation | null,
  onlyAvailable: boolean,
  distanceBetweenCoordinatesKm: (
    firstLatitude: number,
    firstLongitude: number,
    secondLatitude: number,
    secondLongitude: number,
  ) => number,
): ShelterSearchResult[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchingShelters = shelters.filter((shelter) =>
    [
      shelter.name,
      shelter.location,
      shelter.operationalStatus,
      shelter.availabilityStatus,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch),
  );

  if (!nearbyLocation) {
    return matchingShelters.map((shelter) => ({ shelter }));
  }

  return matchingShelters
    .filter((shelter) => shelter.locationPoint?.coordinates.length === 2)
    .map((shelter) => {
      const [longitude, latitude] = shelter.locationPoint!.coordinates;
      return {
        shelter,
        distanceKm: distanceBetweenCoordinatesKm(
          nearbyLocation.latitude,
          nearbyLocation.longitude,
          latitude,
          longitude,
        ),
      };
    })
    .filter(
      ({ shelter }) =>
        !onlyAvailable ||
        (shelter.operationalStatus === "Open" && shelter.availableSpaces > 0),
    )
    .sort((first, second) => first.distanceKm! - second.distanceKm!);
}
