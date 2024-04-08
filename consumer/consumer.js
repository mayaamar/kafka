import { kafka } from "./client.js";
const consumer = kafka.consumer({ groupId: "my-group" });



console.log("subscribed");

const run = async () => {
  await consumer.connect();
  console.log("connected");

  await consumer.subscribe({
    topic: "mongo-.rocketchat.rocketchat_message",
    fromBeginning: false,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `my-group: [${topic}]: PART:${partition}:`,
        JSON.parse(message.value.toString())
      );
    },
  });
};

run().catch(console.error);
