import {defineConfig} from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents() {
        },
    },
    env: {
        base_url: "http://localhost:3000"
    },
});
