import { driver, api } from "@rocket.chat/sdk";
import config from "./config.js";

export const startReceiving = async () => {
  console.log(config.username);
  await driver.connect({ host: "localhost:3000" });
  await api.login({ username: config.username, password: config.password });
};

export const sendDirectMessage = async (content, username) =>
  await driver.sendDirectToUser(content, username);

export const isAdmin = async (id) => {
  const user = (await api.get("users.info", { userId: id })).user;

  return user?.roles?.some((role) => role === "admin") || false;
};

export const getUsersInRoom = async (id) => {
  const room = await api.get("rooms.info", { roomId: id });
  const users = await api.post("method.call/getUsersOfRoom", {
    message: JSON.stringify({
      msg: "method",
      method: "getUsersOfRoom",
      params: [id, true, { limit: room.room.usersCount, skip: 0 }],
    }),
  });
  return JSON.parse(users.message).result.records;
};

export const renameRoom = async (id, name) =>
  await api.post("method.call/saveRoomSettings", {
    message: JSON.stringify({
      msg: "method",
      method: "saveRoomSettings",
      params: [id, "roomName", name],
    }),
  });

export const sendMessage = (body) => api.post("chat.postMessage", body);
export const getRoomId = (id) => api.get("rooms.info", {roomId: id});
