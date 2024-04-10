import { kafka } from "./client.js";
import { handler } from "./handler.js";
import connectToDB from "./service.js";

await connectToDB();

const wordsMap = new Map();
const consumer = kafka.consumer({ groupId: "my-group" });

console.log("subscribed");

const run = async () => {
  await consumer.connect();
  console.log("connected");

  await consumer.subscribe({
    topic: "mongo.rocketchat.rocketchat_message",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const doc = JSON.parse(JSON.parse(message.value)).fullDocument;

      if (
        doc.u._id &&
        (await handler.isAdmin(doc.u._id)) &&
        doc.msg === "log popular word"
      ) {
        console.log(handler.getPopularWord(wordsMap));
      } else {
        doc.msg.split(" ").forEach((word) => {
          wordsMap.get(word)
            ? wordsMap.set(word, wordsMap.get(word) + 1)
            : wordsMap.set(word, 1);
        });
      }
      
    },
  });
};

run().catch(console.error);
