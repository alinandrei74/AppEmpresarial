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
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6IkFkbWluIiwibmFtZSI6IkpvaG4iLCJmaXJzdG5hbWUiOiJTbWl0aCIsImxhc3RuYW1lIjoiSm9obnNvbiIsImRuaSI6IjEyMzQ1Njc4OUEiLCJlbWFpbCI6ImV4YW1wbGUxQGV4YW1wbGUuY29tIiwidGVsZXBob25lIjoiMTIzNDU2Nzg5MCIsImFkZHJlc3MiOiIxMjMgRXhhbXBsZSBTdCIsInBhc3N3b3JkIjoiJDJhJDEwJHE4bnhKUnB2TVdJSUdqb0Y1Q2c0WC45YVhCWjRnaWxWZWZNbUhSbEZtTUljSnlSdjNkUGRPIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDktMTZUMTQ6NDQ6NDAuMTIyWiIsInVwZGF0ZWRfYXQiOiIyMDI0LTA5LTE2VDE1OjMyOjI3Ljc0NVoiLCJwb3N0YWxfY29kZSI6bnVsbH0sImlhdCI6MTcyNzIwNzQwOSwiZXhwIjoxNzI3MjExMDA5fQ.UT7Alm6qjJfgjz1HPXiY4ooF_W_bcI0t3gAeHBEtIF4";
    }
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
