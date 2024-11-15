import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export async function authenticate(
  request: FastifyRequest,
  replay: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await replay.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );

    return replay.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return replay.status(400).send({ message: err.message });
    }

    throw err;
  }
}
