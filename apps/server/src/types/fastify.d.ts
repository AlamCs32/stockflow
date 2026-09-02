import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    jwt: import('@fastify/jwt').FastifyJWT;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      isActive: boolean;
    };
    user: {
      userId: string;
      isActive: boolean;
    };
  }
}
