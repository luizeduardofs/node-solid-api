import { IGymsRepository } from "@/repositories/gym-repository";
import type { Gym } from "@prisma/client";

interface IFetchNearbyGymsUseCase {
  userLatitude: number;
  userLongitude: number;
}

interface IFetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsUseCase): Promise<IFetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
