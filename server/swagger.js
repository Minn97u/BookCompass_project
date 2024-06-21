const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "BookCompass API",
            version: "1.0.0",
            description: "API documentation for BookCompass application",
        },
        servers: [
            {
                url: "kdt-ai-10-team04.elicecoding.com",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
