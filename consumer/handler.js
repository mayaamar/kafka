import { client } from "./service.js";
import fs from "fs";

export const handler = {
  isAdmin: async (id) => {
    const user = await client
      .db("rocketchat")
      .collection("users")
      .findOne({ _id: id });
    return user.roles.some((role) => role === "admin");
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
};
