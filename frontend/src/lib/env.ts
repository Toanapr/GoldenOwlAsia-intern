function requireEnvironmentVariable(name: 'VITE_API_URL') {
  const value = import.meta.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const environment = {
  apiUrl: requireEnvironmentVariable('VITE_API_URL'),
} as const
