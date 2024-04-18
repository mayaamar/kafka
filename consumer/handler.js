import {
  getUsersInRoom,
  getRoomId,
  renameRoom,
  sendMessage,
} from "./rocketchat.js";
const wordsMap = new Map();
export const handler = {
  getPopularWord: () => {
    if (wordsMap.size === 0) return "No words were logged";

    let maxWord = "No max was found";

    wordsMap.forEach((count, word) => {
      if (count === Math.max(...Array.from(wordsMap.values()))) {
        maxWord = word;
      }
    });

    return maxWord;
  },
  mapWords: (words) => {
    words.forEach((word) => {
      wordsMap.get(word)
        ? wordsMap.set(word, wordsMap.get(word) + 1)
        : wordsMap.set(word, 1);
    });
  },
  reverseWords: async (id, name) => {
    const nameWords = name.split(/ |-/gm);
    let newName = "";
    nameWords.forEach((word) => (newName += "-" + reverseString(word)));
    newName = newName.substring(1);
    await renameRoom(id, newName);
  },

  sendWelcome: (username) =>
    sendMessage({
      channel: `@${username}`,
      text: "Welcome to rocketchat " + username + " !",
      emoji: ":grinning:",
    }),
  notify: async (msg) => {
    const result = await getUsersInRoom(msg.rid);
    const room = (await getRoomId(msg.rid)).room;

    await Promise.all(
      result.map(async (user) => {
        await sendMessage({
          channel: `@${user.username}`,
          text: `Notification! ${msg.u.username} edited a message in ${
            room?.fname || room?.name || "This chat"
          } !`,
          emoji: ":open_mouth: ",
        });
      })
    );
  },
  isEdited: (msg) =>
    Object.keys(msg.updateDescription.updatedFields)?.some(
      (field) => field === "msg"
    ),
  didRoomNameChanged: (msg) =>
    msg.operationType === "insert" ||
    (msg.operationType === "update" &&
      Object.keys(msg.updateDescription.updatedFields)?.some(
        (field) => field === "fname" || field === "name"
      )),
};
const reverseString = (str) => str.split("").reverse().join("");
