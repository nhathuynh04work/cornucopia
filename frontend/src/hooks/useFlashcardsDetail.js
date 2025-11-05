// src/hooks/useFlashcardsDetail.js
import { useState, useEffect } from "react";
import { api } from "../apis/axios";
import { toast } from "react-hot-toast";

export function useFlashcardsDetail(listId) {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchList() {
      try {
        setLoading(true);
        const { data } = await api.get(`/lists/${listId}`);
        const { list } = data;
        setTitle(list.title);
        setDescription(list.description);
        setCards(list.flashcards);
      } catch (error) {
        console.error("Lỗi khi tải danh sách:", error);
        toast.error("Không thể tải danh sách!");
      } finally {
        setLoading(false);
      }
    }
    if (listId) fetchList();
  }, [listId]);

  async function createCard(term, definition) {
    try {
      const { data } = await api.post(`/lists/${listId}/cards`, { term, definition });
      setCards((prev) => [...prev, data.card]);
      toast.success("Đã tạo flashcard!");
    } catch {
      toast.error("Không thể tạo thẻ!");
    }
  }

  async function updateCard(cardId, term, definition) {
    try {
      const { data } = await api.put(`/lists/${listId}/cards/${cardId}`, { term, definition });
      setCards((prev) => prev.map((c) => (c.id === cardId ? data.card : c)));
      toast.success("Đã cập nhật flashcard!");
    } catch {
      toast.error("Không thể cập nhật thẻ!");
    }
  }

  async function deleteCard(cardId) {
    try {
      await api.delete(`/cards/${cardId}`);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      toast.success("Đã xoá flashcard!");
    } catch {
      toast.error("Không thể xoá flashcard!");
    }
  }

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
    cards,
    title,
    description,
    loading,
    createCard,
    updateCard,
    deleteCard,
    startSession,
    setCards,
  };
}
