import env from "env-var";
import "dotenv/config";
const config = {
  topics: env.get("TOPICS").required().asArray(),
  username: env.get("USERNAME").required().asString(),
  password: env.get("PASSWORD").required().asString(),
};
export default config;
