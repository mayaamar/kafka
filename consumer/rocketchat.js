import { driver, api } from "@rocket.chat/sdk";
import config from "./utils/config.js";
import { NotFoundException } from "./exceptions/notFoundException.js";
import CustomError from "./exceptions/CustomError.js";

export const connectToApi = async () => {
  try {
    await driver.connect({ host: config.rocketchatUrl });
    await api.login({ username: config.username, password: config.password });
  } catch (error) {
    throw new CustomError(error.message);
  }
};

export const sendDirectMessage = async (content, username) =>
  await driver.sendDirectToUser(content, username);

export const isAdmin = async (id) => {
  const user = (await api.get("users.info", { userId: id }))?.user;
  if (!user) {
    throw new NotFoundException(`User ${id} not Found`);
  }
  return user?.roles?.some((role) => role === "admin") || false;
};

export const getUsersInRoom = async (id) => {
  const room = await api.get("rooms.info", { roomId: id });

  if (!room) {
    throw NotFoundException(`Room ${id} not found`);
  }
  const users = await api.post("method.call/getUsersOfRoom", {
    message: JSON.stringify({
      msg: "method",
      method: "getUsersOfRoom",
      params: [1, true, { limit: room.room.usersCount, skip: 0 }],
    }),
  });
  if (JSON.parse(users.message)?.error) {
    throw new CustomError(JSON.parse(users.message).error.message);
  }
  return JSON.parse(users.message).result.records;
};

export const renameRoom = async (id, name) => {
  const result = await api.post("method.call/saveRoomSettings", {
    message: JSON.stringify({
      msg: "method",
      method: "saveRoomSettings",
      params: [id, "roomName", name],
    }),
  });
  if (JSON.parse(result.message)?.error) {
    throw new CustomError(JSON.parse(result.message).error.message);
  }
};

export const sendMessage = async (body) => {
  const result = await api.post("chat.postMessage", body);
  if (JSON.parse(result.message)?.error) {
    throw new CustomError(JSON.parse(result.message).error.message);
  }
};
export const getRoomId = async (id) => {
  const room = await api.get("rooms.info", { roomId: id });
  if (!room) {
    throw new NotFoundException(`Room ${id} not found`);
  }
};
