import { kafka } from "./kafka.js";
import config from "./config.js";
import "dotenv/config";
import { renameRoom, isAdmin, startReceiving } from "./rocketchat.js";
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
  let prevTimeStamp = null;
  const wordsMap = new Map();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const msg = JSON.parse(JSON.parse(message.value));
      const doc = msg.fullDocument;

      switch (topic) {
        case "rocketchat.rocketchat_message":
          consumerFunc.get(topic)(msg, doc);

          break;

        case "rocketchat.rocketchat_room":
          consumerFunc.get(topic)(msg, doc);

          break;

        case "rocketchat.users":
          consumerFunc.get(topic)(msg, doc);

          break;
        default:
          break;
      }
    },
  });
};

run().catch(console.error);
