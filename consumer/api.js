import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "X-Auth-Token": "Eq8oJZuboZvVhznsx872bdTv9rCluTlgdGX7azKSyWf",
    "X-User-Id": "xhFuAm52iQ6oAktPS",
    "Content-type": "application/json",
  },
});

export const messageApi = {
  send: async (body) => {
    const respone = await instance.post("/api/v1/chat.postMessage", body);
    return respone.data;
  },
};
