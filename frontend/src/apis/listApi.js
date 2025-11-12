import { api } from "./axios";

export async function getListsOfUser() {
  const { data } = await api.get(`/lists`);
  return data.lists;
}

export async function getExploreLists() {
  const { data } = await api.get("/lists/explore");
  return data.lists;
}
