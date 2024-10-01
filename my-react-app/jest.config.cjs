module.exports = {
  testEnvironment: "node",
  testMatch: [
    "**/tests@jest/**/?(*.)+(test).[tj]s?(x)", // Solo incluye archivos de tests dentro de carpetas tests@jest
    "**/tests@jest/**/?(*.)+(test).mjs", // Incluir archivos .mjs en tests@jest
  ],
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest", // Transformar .mjs
  },
  moduleFileExtensions: ["js", "jsx", "mjs"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  setupFiles: ["<rootDir>/jest.setup.js"], // Setup de Jest
  testPathIgnorePatterns: [
    "^(?!.*tests@jest).*", // Excluir cualquier carpeta que no se llame "tests@jest"
  ],
};
