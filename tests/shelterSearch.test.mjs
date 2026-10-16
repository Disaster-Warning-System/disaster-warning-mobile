import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getVisibleShelters } from "../src/utils/shelterSearch.ts";
import { distanceBetweenCoordinatesKm } from "../src/utils/geo.ts";

function shelter(overrides = {}) {
  return {
    id: "shelter-1",
    name: "Colombo Community Hall",
    location: "Colombo 07",
    locationPoint: { type: "Point", coordinates: [79.8612, 6.9271] },
    capacity: 100,
    occupancy: 40,
    operationalStatus: "Open",
    remarks: "",
    availableSpaces: 60,
    availabilityStatus: "Open",
    createdAt: "2026-10-09T00:00:00.000Z",
    updatedAt: "2026-10-09T00:00:00.000Z",
    ...overrides,
  };
}

describe("citizen shelter search and nearby results", () => {
  it("searches shelter names and locations without case sensitivity", () => {
    const results = getVisibleShelters(
      [shelter(), shelter({ id: "shelter-2", name: "Kandy School", location: "Kandy" })],
      "COLOMBO",
      null,
      false,
      distanceBetweenCoordinatesKm,
    );

    assert.deepEqual(results.map(({ shelter: item }) => item.id), ["shelter-1"]);
  });

  it("sorts map-located shelters by straight-line distance from the citizen", () => {
    const far = shelter({
      id: "far",
      name: "Far shelter",
      locationPoint: { type: "Point", coordinates: [80.6367, 7.2906] },
    });
    const near = shelter({
      id: "near",
      name: "Nearby shelter",
      locationPoint: { type: "Point", coordinates: [79.865, 6.93] },
    });

    const results = getVisibleShelters(
      [far, near],
      "",
      { latitude: 6.9271, longitude: 79.8612 },
      false,
      distanceBetweenCoordinatesKm,
    );

    assert.deepEqual(results.map(({ shelter: item }) => item.id), ["near", "far"]);
    assert.ok(results[0].distanceKm < results[1].distanceKm);
  });

  it("filters nearby results to open shelters with free spaces", () => {
    const available = shelter({ id: "available" });
    const full = shelter({
      id: "full",
      occupancy: 100,
      availableSpaces: 0,
      availabilityStatus: "Full",
    });
    const closed = shelter({ id: "closed", operationalStatus: "Closed" });

    const results = getVisibleShelters(
      [available, full, closed],
      "",
      { latitude: 6.9271, longitude: 79.8612 },
      true,
      distanceBetweenCoordinatesKm,
    );

    assert.deepEqual(results.map(({ shelter: item }) => item.id), ["available"]);
  });

  it("omits shelters without map points from nearby results", () => {
    const results = getVisibleShelters(
      [shelter({ locationPoint: null })],
      "",
      { latitude: 6.9271, longitude: 79.8612 },
      false,
      distanceBetweenCoordinatesKm,
    );

    assert.equal(results.length, 0);
  });
});
