import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create a new gym", async () => {
    const { gym } = await sut.execute({
      title: "javaScript Gym",
      description: null,
      phone: null,
      latitude: -22.6568447,
      longitude: -44.8599034,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
