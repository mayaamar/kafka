import config from "./config.js";
import { handler } from "./handler.js";
import { renameRoom, isAdmin, startReceiving } from "./rocketchat.js";

const topics = config.topics;
export const consumerFunc = new Map();
let prevTimeStamp = null;
export const setConsumerFunc = () => {
  consumerFunc.set(topics[0], async (msg, doc) => {
    switch (msg.operationType) {
      case "insert":
        if (
          doc?.u._id &&
          doc.msg === "log popular word" &&
          (await isAdmin(doc.u._id))
        ) {
          console.log(handler.getPopularWord());
        } else {
          handler.mapWords(doc?.msg.split(" "));
        }
        break;
      case "update":
        const id = msg.documentKey._id;
        handler.notify(doc);
        break;
    }
  });
  consumerFunc.set(topics[1], async (msg, doc) => {
    const nameChanged =
      msg.operationType === "insert" ||
      (msg.operationType === "update" &&
        Object.keys(msg.updateDescription.updatedFields)?.some(
          (field) => field === "fname"
        ));
    if (
      nameChanged &&
      doc?.fname &&
      (doc?.fname.includes("cat") || doc?.fname.includes("black"))
    ) {
      if (
        nameChanged &&
        doc?.fname &&
        (doc?.fname.includes("cat") || doc?.fname.includes("black"))
      ) {
        
        if (
          !prevTimeStamp ||
          Math.abs(msg.clusterTime.$timestamp.t - prevTimeStamp) > 10
        ) {
          prevTimeStamp = msg.clusterTime.$timestamp.t;
          handler.reverseWords(doc._id, doc.fname);
        }
      }
    }
  });
  consumerFunc.set(topics[2], async (msg, doc) => {
    if (msg.operationType === "insert") {
      handler.sendWelcome(doc.username);
    }
  });
};
