import env from "env-var";
import "dotenv/config";
const config = {
  topics: env.get("TOPICS").required().asArray(),
  username: env.get("USERNAME").required().asString(),
  password: env.get("PASSWORD").required().asString(),
  rocketchatUrl: env.get("ROCKETCHAT_URL").required().asString(),
  kafkaUrl: env.get("KAFKA_URL").required().asString(),
};
export default config;
