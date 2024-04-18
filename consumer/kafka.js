import { Kafka } from "kafkajs";
import config from "./utils/config.js";

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: [config.kafkaUrl],
});
