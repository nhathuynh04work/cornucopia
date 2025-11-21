/* eslint-disable no-unused-vars */
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as listApi from "@/apis/listApi";

export function useFlashcardsDetail(listId) {
  const queryClient = useQueryClient();

  const { data: list, isPending: isLoading } = useQuery({
    queryFn: () => listApi.getListDetail(listId),
    queryKey: ["list", Number(listId)],
  });

  const {
    mutate: createCard,
    isPending: isCreatingCard,
    isError: isCreateCardError,
  } = useMutation({
    mutationFn: ({ term, definition }) =>
      listApi.createCard({ listId, term, definition }),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists"]);
      queryClient.invalidateQueries(["list", Number(listId)]);
    },
  });

  const {
    mutate: updateCard,
    isPending: isUpdatingCard,
    isError: isUpdateCardError,
  } = useMutation({
    mutationFn: ({ cardId, term, definition }) =>
      listApi.updateCard( Number(listId), cardId, term, definition ),
    onSuccess: () => {
      queryClient.invalidateQueries(["list", Number(listId)]);
    },
  });

  const {
    mutate: deleteCard,
    isPending: isDeletingCard,
    isError: isDeleteCardError,
  } = useMutation({
    mutationFn: ({ cardId }) => listApi.deleteCard( cardId ),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists"]);
      queryClient.invalidateQueries(["list", Number(listId)]);
    },
  });

  const {
    mutate: createCardsBulk,
    isPending: isCreatingBulk,
    isError: isCreateBulkError,
  } = useMutation({
    mutationFn: ({ cardsArray }) =>
      listApi.createCardsBulk({ listId, cardsArray }),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists"]);
      queryClient.invalidateQueries(["list", Number(listId)]);
    },
  });

  const {
    mutate: updateList,
    isPending: isUpdatingList,
    isError: isUpdateListError,
  } = useMutation({
    mutationFn: (payload) => listApi.updateList({ listId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists"]);
      queryClient.invalidateQueries(["list", Number(listId)]);
    },
  });

  const {
    mutate: deleteList,
    isPending: isDeletingList,
    isError: isDeleteListError,
  } = useMutation({
    mutationFn: () => listApi.deleteList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries(["lists"]);
      queryClient.invalidateQueries(["list", Number(listId)]);
    },
  });

  async function startSession() {
    try {
      const { data } = await api.post(`/lists/${listId}/sessions`);
      toast.success("Đã bắt đầu buổi học!");
      return data.session;
    } catch {
      toast.error("Không thể bắt đầu buổi học!");
      return null;
    }
  }

  return {
    list,
    isLoading,
    updateList,
    deleteList,
    createCard,
    createCardsBulk,
    updateCard,
    deleteCard,
    startSession,
  };
}
