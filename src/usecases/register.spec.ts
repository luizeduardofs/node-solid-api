import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";
import { RegisterUseCase } from "./register";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "jd@gmail.com",
      password: "12345678",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "jd@gmail.com",
      password: "12345678",
    });

    const isPasswordCorrectlyHashed = await compare(
      "12345678",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able register with same email twice", async () => {
    const email = "jd@gmail.com";

    await sut.execute({
      name: "John Doe",
      email: email,
      password: "12345678",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email: email,
        password: "12345678",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
