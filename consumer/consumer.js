import { kafka } from "./kafka.js";
import config from "./utils/config.js";
import "dotenv/config";
import { connectToApi } from "./rocketchat.js";
import { consumerFunc, initConsumerFunc } from "./consumerLogic.js";

const consumer = kafka.consumer({ groupId: "my-group" });
const init = async () => {
  await consumer.connect();
  await connectToApi();
  initConsumerFunc();
};
const run = async () => {
  console.log("connected");
  await consumer.subscribe({
    topics: config.topics,
    fromBeginning: false,
  });
  console.log("subscribed");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = JSON.parse(JSON.parse(message.value));
      const doc = msg.fullDocument;

      consumerFunc.get(topic)(msg, doc);
    },
  });
};

try {
  await init();
  await run();
} catch (error) {
  console.log(error.message);
}
