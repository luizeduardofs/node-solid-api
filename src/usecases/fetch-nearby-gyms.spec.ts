import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -22.6568447,
      longitude: -44.8599034,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -22.6980484,
      longitude: -42.7889215,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.6568447,
      userLongitude: -44.8599034,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
