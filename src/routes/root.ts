export async function root(request, reply) {
    reply.code(200)
        .type('text/html')
        .send('<h2> Hello Fastify from routes dir! </h2>');
};
