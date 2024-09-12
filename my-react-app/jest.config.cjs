module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/src/**/?(*.)+(test).[tj]s?(x)",
    "**/src/**/?(*.)+(test).mjs",
    "**/tests@jest/**/?(*.)+(test).[tj]s?(x)", // Agregar este patrón para incluir la carpeta tests@jest
    "**/tests@jest/**/?(*.)+(test).mjs", // Incluir archivos .mjs en tests@jest
  ],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest", // Agregar esta línea para transformar .mjs
  },
  moduleFileExtensions: ["js", "jsx", "mjs"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFiles: ["<rootDir>/jest.setup.js"], // Agregar esta línea
};
