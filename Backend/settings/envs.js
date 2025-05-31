import { config } from "dotenv";

config();

export const env = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key-for-dev-do-not-use-in-prod',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/travel_platform_db_dev',
};
