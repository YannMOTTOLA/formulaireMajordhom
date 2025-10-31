export const config = {
  port: Number.parseInt(process.env.PORT || "3000"),
  allowedOrigins: getEnv(process.env.ALLOWED_ORIGINS, "ALLOWED_ORIGINS"),
  jwtSecret: getEnv(process.env.JWT_SECRET, "JWT_SECRET")
};


function getEnv(value: string | undefined, variableName: string) {
  if (!value) { throw new Error(`Missing env variable: ${variableName}`); }
  return value;
}