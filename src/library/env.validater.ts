export function validateDOTENV() {
  const requiredEnvVariables = [
    'PORT',
    'JWT_SECRET',
    'DATABASE_HOST',
    'DATABASE_USER_PASSWORD',
  ];

  const missingEnvVariables = requiredEnvVariables.filter(variable => !process.env[variable]);

  if (missingEnvVariables.length > 0) {
    console.error(`Error: Missing required environment variables ${missingEnvVariables.join(', ')}`);
    process.exit(1);
  }
}
