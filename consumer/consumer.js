import { kafka } from "./kafka.js";
import { handler } from "./handler.js";
import connectToDB from "./service.js";

await connectToDB();

const consumer = kafka.consumer({ groupId: "my-group" });

console.log("subscribed");

const run = async () => {
  await consumer.connect();
  console.log("connected");

  await consumer.subscribe({
    topics: [
      "mongo.rocketchat.rocketchat_message",
      "mongo.rocketchat.rocketchat_room",
      "mongo.rocketchat.users",
    ],
    fromBeginning: false,
  });
  let prevTimeStamp = null;
  const wordsMap = new Map();

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      let doc = undefined;
      const msg = JSON.parse(JSON.parse(message.value));

      switch (topic) {
        case "mongo.rocketchat.rocketchat_message":
          if (msg.operationType === "insert") {
            doc = msg.fullDocument;

            if (
              doc?.u._id &&
              (await handler.isAdmin(doc.u._id)) &&
              doc.msg === "log popular word"
            ) {
              console.log(handler.getPopularWord(wordsMap));
            } else {
              doc?.msg.split(" ").forEach((word) => {
                wordsMap.get(word)
                  ? wordsMap.set(word, wordsMap.get(word) + 1)
                  : wordsMap.set(word, 1);
              });
            }
          } else if (msg.operationType === "update") {
            const id = msg.documentKey._id;
            handler.notify(id);
          }
          break;

        case "mongo.rocketchat.rocketchat_room":
          doc =
            msg.operationType === "insert"
              ? msg.fullDocument
              : msg.operationType === "update" &&
                Object.keys(msg.updateDescription.updatedFields)?.some(
                  (field) => field === "fname"
                )
              ? msg.updateDescription.updatedFields
              : null;
          doc =
            doc && msg.operationType === "update"
              ? { ...doc, _id: msg.documentKey._id }
              : doc;
          if (
            doc?.fname &&
            (doc?.fname.includes("cat") || doc?.fname.includes("black"))
          ) {
            if (
              !prevTimeStamp ||
              Math.abs(msg.clusterTime.$timestamp.t - prevTimeStamp) > 20
            ) {
              prevTimeStamp = msg.clusterTime.$timestamp.t;
              handler.reverseWords(doc._id, doc.fname);
            }
          }
          break;

        case "mongo.rocketchat.users":
          if (msg.operationType === "insert") {
            doc = msg.fullDocument;
            handler.sendWelcome(doc.username);
          }
          break;
        default:
          break;
      }
    },
  });
};

run().catch(console.error);
