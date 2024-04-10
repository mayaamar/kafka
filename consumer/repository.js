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
  getRoomWithUsers: (id) =>
    client
      .db("rocketchat")
      .collection("rocketchat_room")
      .aggregate([
        { $match: { _id: id } },
        {
          $lookup: {
            from: "rocketchat_subscription",
            localField: "_id",
            foreignField: "rid",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $lookup: {
            from: "users",
            localField: "user.u._id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $group: {
            _id: "$_id",
            users: { $push: "$user" },
            name: { $first: "$name" },
            fname: { $first: "$fname" },
          },
        },
      ])
      .toArray(),
};

export const message = {
  getById: (id) =>
    client
      .db("rocketchat")
      .collection("rocketchat_message")
      .findOne({ _id: id }),
};
