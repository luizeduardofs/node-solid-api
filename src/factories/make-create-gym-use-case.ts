import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "@/usecases/create-gym";

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CreateGymUseCase(gymsRepository);

  return useCase;
}
