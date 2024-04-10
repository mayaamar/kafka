import { client } from "./service.js";

export const user = {
  getById: (id) =>
    client.db("rocketchat").collection("users").findOne({ _id: id }),
};

export const room = {
  changeName: (id, name) =>
    client
      .db("rocketchat")
      .collection("rocketchat_room")
      .updateOne({ _id: id }, { $set: { fname: name, name: name } }),
};
