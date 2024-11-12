import { MaxDistanceError } from "@/errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "@/errors/max-number-of-check-ins-error";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "0001",
      title: "Academia do Typescript",
      description: "",
      phone: "",
      latitude: -22.6568447,
      longitude: -44.8599034,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "0001",
      gymId: "0001",
      userLatitude: -22.6568447,
      userLongitude: -44.8599034,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    await sut.execute({
      userId: "0001",
      gymId: "0001",
      userLatitude: -22.6568447,
      userLongitude: -44.8599034,
    });

    await expect(() =>
      sut.execute({
        userId: "0001",
        gymId: "0001",
        userLatitude: -22.6568447,
        userLongitude: -44.8599034,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20));

    await sut.execute({
      userId: "0001",
      gymId: "0001",
      userLatitude: -22.6568447,
      userLongitude: -44.8599034,
    });

    vi.setSystemTime(new Date(2022, 0, 21));

    const { checkIn } = await sut.execute({
      userId: "0001",
      gymId: "0001",
      userLatitude: -22.6568447,
      userLongitude: -44.8599034,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "0002",
      title: "Academia do Javascript",
      description: "",
      phone: "",
      latitude: new Decimal(-20.0390954),
      longitude: new Decimal(-43.6427357),
    });

    await expect(() =>
      sut.execute({
        userId: "0001",
        gymId: "0002",
        userLatitude: -22.6568447,
        userLongitude: -44.8599034,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
