import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV || "local"}` });

const secrets = {
  TWITTER_API_URL: process.env.TWITTER_API_URL,
  TWITTER_API_TOKEN: process.env.TWITTER_API_TOKEN,
  SUPABASE_API_URL: process.env.SUPABASE_API_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_DATABASE_TABLE_NAME: process.env.SUPABASE_DATABASE_TABLE_NAME,
};

for (const key in secrets) {
  if (Object.prototype.hasOwnProperty.call(secrets, key)) {
    const element = secrets[key];
    if (!element) {
      throw `Missing environment variable: ${key}`;
    }
  }
}

export default secrets;
