import { api } from "./axios";

export async function getListsOfUser() {
  const { data } = await api.get(`/lists`);
  return data.lists;
}
