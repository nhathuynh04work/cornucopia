import { api } from "./axios";

export async function getAllTopis() {
  const { data } = await api.get(`/topics`);
  return data.topics;
}
