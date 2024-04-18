import config from "./utils/config.js";
import { handler } from "./handler.js";
import { isAdmin } from "./rocketchat.js";
import tryCatchWrapper from "./utils/trycatchWrapper.js";

const topics = config.topics;
export const consumerFunc = new Map();
let prevTimeStamp = null;
export const initConsumerFunc = () => {
  consumerFunc.set(
    topics[0],
    tryCatchWrapper(async (msg, doc) => {
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
          if (handler.isEdited(msg)) {
            await handler.notify(doc);
          }
          break;
      }
    })
  );
  consumerFunc.set(
    topics[1],
    tryCatchWrapper(async (msg, doc) => {
      const nameChanged = handler.didRoomNameChanged(msg);
      if (
        nameChanged &&
        (doc.fname.includes("cat") || doc.fname.includes("black"))
      ) {
        if (
          !prevTimeStamp ||
          Math.abs(msg.clusterTime.$timestamp.t - prevTimeStamp) > 10
        ) {
          prevTimeStamp = msg.clusterTime.$timestamp.t;
          await handler.reverseWords(doc._id, doc.fname);
        }
      }
    })
  );
  consumerFunc.set(
    topics[2],
    tryCatchWrapper(async (msg, doc) => {
      if (msg.operationType === "insert") {
        await handler.sendWelcome(doc.username);
      }
    })
  );
};
