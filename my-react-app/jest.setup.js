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
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMSwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJBZG1pbjIiLCJuYW1lIjoiTWFyaXNhIiwiZmlyc3RuYW1lIjoiTWFyaXNhIiwibGFzdG5hbWUiOiJUcmlndWVyb3MiLCJkbmkiOiIxMjM0NTY3NkEiLCJlbWFpbCI6ImFkbWluMkBleGFtcGxlLmNvbSIsInRlbGVwaG9uZSI6IjEyMzQ1Njc4OTAiLCJhZGRyZXNzIjoiTWFpblN0cmVldCIsInBhc3N3b3JkIjoiJDJhJDEwJHM2OWRZdVJRVUpkc1d0YU41NkIxSXUxVGR2NjQyWUpnT1o4SEd6Yi42eWVHZnBCZXJwMmpxIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDktMTZUMjA6MjY6MTcuNjY4WiIsInVwZGF0ZWRfYXQiOiIyMDI0LTA5LTE2VDIwOjI2OjE3LjY2OFoiLCJwb3N0YWxfY29kZSI6bnVsbH0sImlhdCI6MTcyNzIxODk1NCwiZXhwIjoxNzI3MjIyNTU0fQ.8_PaqjWqcfkajPmi0Es7qTnYRZxu4fuKEXIY418_r2k";
    }
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
