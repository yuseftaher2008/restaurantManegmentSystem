const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restaurant Management System API",
            version: "1.0.0",
            description: "API for managing restaurant operations including users, categories, and menu items",
        },
        servers: [
            {
                url: "/api",
                description: "API server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        email: { type: "string", format: "email" },
                        role: { type: "string", enum: ["ADMIN", "STAFF", "CUSTOMER"] },
                    },
                },
                Category: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};
export default swaggerOptions;
