import { IUsersRepository } from "@/repositories/users-repository";

interface IAuthenticateUseCaseRequest {
  email: string;
  password: string;
}

type IAuthenticateUseCaseResponse = void;

export class AuthenticateUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUseCaseRequest): Promise<IAuthenticateUseCaseResponse> {}
}
