import type { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Restaurant Management System API",
      version: "1.0.0",
      description: "API for managing restaurant operations including users, categories, menu items, orders, payments, and inventory",
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
        MenuItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            price: { type: "number" },
            description: { type: "string" },
            image: { type: "string" },
            categoryId: { type: "string", format: "uuid" },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            unit: { type: "string", enum: ["KG", "G", "L", "ML", "PIECE"] },
            quantity: { type: "integer" },
            minimumQuantity: { type: "integer" },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            userId: { type: "string", format: "uuid" },
            status: { type: "string", enum: ["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"] },
            orderType: { type: "string", enum: ["DINE_IN", "TAKEAWAY", "DELIVERY"] },
            totalAmount: { type: "number" },
          },
        },
        Payment: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            orderId: { type: "string", format: "uuid" },
            amount: { type: "number" },
            method: { type: "string", enum: ["CASH", "CARD", "WALLET"] },
            status: { type: "string", enum: ["PENDING", "PAID", "FAILED", "REFUNDED"] },
            transactionReference: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
            statusCode: { type: "integer" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
