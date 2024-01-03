import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import replace from "@rollup/plugin-replace";

export default defineConfig({
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify("production"),
            preventAssignment: true,
        }),
        react({ jsxRuntime: "classic" }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.tsx"),
            name: "library",
        },
        minify: false,
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
});
