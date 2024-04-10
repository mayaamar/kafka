import fs from "fs";
import { room, user, message } from "./repository.js";
import { messageApi } from "./api.js";

export const handler = {
  isAdmin: async (id) => {
    const fullUser = await user.getById(id);

    return fullUser.roles?.some((role) => role === "admin");
  },
  mapWords: (message) => {
    const wordMap = getWordMap();

    const words = message.split(" ");
    words.forEach((word) => {
      wordMap[word] = wordMap[word] ? wordMap[word] + 1 : 1;
    });
    fs.writeFileSync("wordMap.txt", JSON.stringify(wordMap), {
      flag: "w",
    });
  },
  getPopularWord: (wordsMap) => {
    if (wordsMap.size === 0) return "No words were logged";

    let maxWord = "No max was found";

    wordsMap.forEach((count, word) => {
      if (count === Math.max(...Array.from(wordsMap.values()))) {
        maxWord = word;
      }
    });

    return maxWord;
  },
  reverseWords: async (id, name) => {
    const nameWords = name.split(/ |-/gm);
    let newName = "";
    nameWords.forEach((word) => (newName += "-" + handler.reverseString(word)));
    newName = newName.substring(1);
    await room.changeName(id, newName);
  },
  reverseString: (str) => str.split("").reverse().join(""),
  sendWelcome: (username) =>
    messageApi.send({
      channel: `@${username}`,
      text: "Welcome to rocketchat " + username + " !",
      emoji: ":grinning:",
    }),
  notify: async (id) => {
    const msg = await message.getById(id);
    const result = (await room.getRoomWithUsers(msg.rid))[0];
    result.users.forEach((user) =>
      messageApi.send({
        channel: `@${user.username}`,
        text: `Notification! ${msg.u.username} edited a message in ${result.fname || result.name || "This chat"} !`,
        emoji: ":open_mouth: ",
      })
    );
  },
};
