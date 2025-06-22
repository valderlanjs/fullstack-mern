module.exports = {
    apps: [
        {
            name: "ecommerce-mad",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development",
                ENV_VAR1: "envioronment-variable",
            }
        }
    ]
}