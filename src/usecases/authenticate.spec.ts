import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { AuthenticateUseCase } from "./authenticate";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "jd@gmail.com",
      password_hash: await hash("12345678", 6),
    });

    const { user } = await sut.execute({
      email: "jd@gmail.com",
      password: "12345678",
    });

    expect(user?.id).toEqual(expect.any(String));
  });

  it("should be able to authenticate with wrong email", async () => {
    await expect(() =>
      sut.execute({
        email: "jd@gmail.com",
        password: "12345678",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "jd@gmail.com",
      password_hash: await hash("12345678", 6),
    });

    await expect(() =>
      sut.execute({
        email: "jd@gmail.com",
        password: "123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
