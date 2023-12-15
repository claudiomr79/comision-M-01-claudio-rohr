import { config } from "dotenv";

config();

export const env = {
  PORT: process.env.PORT || 4000,
  SECRET: process.env.SECRET || "secret",
};
