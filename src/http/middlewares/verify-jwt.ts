import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWT(request: FastifyRequest, replay: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return replay.status(401).send({ message: "Unauthorized" });
  }
}
