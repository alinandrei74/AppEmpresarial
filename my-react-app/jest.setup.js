// Mockear localStorage

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock de sessionStorage para los tests
global.sessionStorage = {
  //! Token de administrador temporal
  //! ⚠️ Este token debe ser actualizado manualmente cada hora
  getItem: jest.fn((key) => {
    if (key === "authToken") {
      // return "mockedAuthToken"; //! Simulamos un token de autenticación
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6IkFkbWluIiwibmFtZSI6IkpvaG4iLCJmaXJzdG5hbWUiOiJTbWl0aCIsImxhc3RuYW1lIjoiSm9obnNvbiIsImRuaSI6IjEyMzQ1Njc4OUEiLCJlbWFpbCI6ImV4YW1wbGUxQGV4YW1wbGUuY29tIiwidGVsZXBob25lIjoiMTIzNDU2Nzg5MCIsImFkZHJlc3MiOiIxMjMgRXhhbXBsZSBTdCIsImNwIjoiMTIzNDUiLCJwYXNzd29yZCI6IiQyYSQxMCRxOG54SlJwdk1XSUlHam9GNUNnNFguOWFYQlo0Z2lsVmVmTW1IUmxGbU1JY0p5UnYzZFBkTyIsImNyZWF0ZWRfYXQiOiIyMDI0LTA5LTE2VDE0OjQ0OjQwLjEyMloiLCJ1cGRhdGVkX2F0IjoiMjAyNC0wOS0xNlQxNTozMjoyNy43NDVaIn0sImlhdCI6MTcyNzEzODgwMCwiZXhwIjoxNzI3MTQyNDAwfQ.sjeFsma4hgOC0cVCvpLb2by2sTE9997jlinu-MAVp7g";
    }
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
