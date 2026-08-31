import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').FastifyJWT;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
    };
    user: {
      sub: string;
      email: string;
    };
  }
}
