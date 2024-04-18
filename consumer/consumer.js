import { kafka } from "./kafka.js";
import config from "./config.js";
import "dotenv/config";
import { startReceiving } from "./rocketchat.js";
import { consumerFunc, setConsumerFunc } from "./consumerLogic.js";

await startReceiving();
setConsumerFunc();
const consumer = kafka.consumer({ groupId: "my-group" });

console.log("subscribed");

const run = async () => {
  await consumer.connect();
  console.log("connected");
  await consumer.subscribe({
    topics: config.topics,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = JSON.parse(JSON.parse(message.value));
      const doc = msg.fullDocument;

      consumerFunc.get(topic)(msg, doc);
    },
  });
};

run().catch(console.error);
