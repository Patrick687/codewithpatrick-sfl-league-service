import dotenv from 'dotenv';
import path from 'path';

type NodeEnv = 'dev' | 'production' | 'test' | 'docker';

function loadEnvironmentConfig() {
    const nodeEnv = process.env.NODE_ENV;
    
    // Map NODE_ENV to corresponding .env file
    const envFileMap: Record<string, string> = {
        'dev': '.env.dev',
        'test': '.env.test',
        'docker': '.env.docker',
        'production': '.env.prod'
    };
    
    const envFile = envFileMap[nodeEnv || 'dev'];
    const envPath = path.resolve(process.cwd(), envFile);
    
    // Load the environment file
    const result = dotenv.config({ path: envPath });
    
    if (result.error && nodeEnv !== 'production') {
        console.warn(`Warning: Could not load ${envFile}, falling back to default values`);
    }
    
    console.log(`🔧 Loaded environment: ${nodeEnv || 'dev'} from ${envFile}`);
}

// Load environment configuration first
loadEnvironmentConfig();

function requireNodeEnv(): NodeEnv {
    const env = process.env.NODE_ENV;
    if (!env) {
        throw new Error('NODE_ENV is not set');
    }
    if (['dev', 'production', 'test', 'docker'].includes(env)) {
        return env as NodeEnv;
    }
    throw new Error(`Invalid NODE_ENV: ${env} - must be one of 'dev', 'production', 'test', or 'docker'`);
}

function requireString(key: string): string {
    const value = process.env[key];
    if (typeof value !== 'string') {
        throw new Error(`Environment variable ${key} is not set or is not a string`);
    }
    return value;
}

function requireInteger(key: string): number {
    const value = process.env[key];
    const intValue = parseInt(value || '', 10);
    if (isNaN(intValue)) {
        throw new Error(`Environment variable ${key} is not set or is not a valid integer`);
    }
    return intValue;
}

function optionalString(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

function optionalInteger(key: string, defaultValue: number): number {
    const value = process.env[key];
    const intValue = parseInt(value || '', 10);
    return isNaN(intValue) ? defaultValue : intValue;
}
const serviceConfig = {
    NODE_ENV: requireNodeEnv(),
    
    // Database configuration
    DB_HOST: requireString('DB_HOST'),
    DB_PORT: requireInteger('DB_PORT'),
    DB_USER: requireString('DB_USER'),
    DB_PASSWORD: requireString('DB_PASSWORD'),
    DB_NAME: 'league_db', // Use fixed database name instead of dynamic

    // Server configuration
    SERVER_HOST: requireString('SERVER_HOST'),
    SERVER_PORT: requireInteger('SERVER_PORT'),
    
    // External Services
    AUTH_SERVICE_URL: optionalString('AUTH_SERVICE_URL', 'http://localhost:3001'),
    
    // Logging
    LOG_LEVEL: optionalString('LOG_LEVEL', 'info'),
    
    // Helper flags
    isDevelopment: requireNodeEnv() === 'dev',
    isProduction: requireNodeEnv() === 'production',
    isTest: requireNodeEnv() === 'test',
    isDocker: requireNodeEnv() === 'docker',
}

export default serviceConfig;