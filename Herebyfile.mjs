import { execa } from "execa";
import { task } from "hereby";

export const build = task({
    name: "build",
    run: async () => {
        await execa("npm run build");
    },
});

export const test = task({
    name: "test",
    dependencies: [build],
    run: async () => {
        await execa("npm run test");
    },
});

// export const lint = task({
//     name: "lint",
//     run: async () => {
//         await runLinter(["./src/**/*.ts"]);
//     },
// });

// export const testAndLint = task({
//     name: "testAndLint",
//     dependencies: [test, lint],
// });

// export default testAndLint;

// export const bundle = task({
//     name: "bundle",
//     dependencies: [build],
//     run: async () => {
//         await execa("esbuild", [
//             "--bundle",
//             "./out/index.js",
//             "--outfile=./out/bundled.js",
//         ]);
//     },
// });