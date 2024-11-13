import { IGymsRepository } from "@/repositories/gym-repository";
import type { Gym } from "@prisma/client";

interface ISearchGymsUseCase {
  query: string;
  page: number;
}

interface ISearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    query,
    page,
  }: ISearchGymsUseCase): Promise<ISearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
