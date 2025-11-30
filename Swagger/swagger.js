const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Smart_it API 명세서",
            description:
                "모든 API요청에는 api/*을 붙이세요 예시 ~~/api/login",
        },
        servers: [
            {
                url: "http://localhost:8008/api",
            },
        ],
        tags: [
            {
                name: "회원인증",
                description: "사용자 로그인/회원가입 API",
            },
        ],
    },
    apis: ["./src_back/auth/auth.js", "./src_back/board/board.js"],
}

const specs = swaggerJsdoc(options)

module.exports = { swaggerUi, specs }
