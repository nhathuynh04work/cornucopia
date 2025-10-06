export async function createList(client, { userId, title = null }) {
  const res = await client.query(
    "INSERT INTO flashcard_lists (user_id, title) VALUES ($1, $2) RETURNING *",
    [userId, title]
  );

  return res.rows[0];
}

export async function getList(client, { listId }) {
  const res = await client.query("SELECT * FROM flashcard_lists WHERE id=$1", [
    listId,
  ]);
  return res.rows[0];
}

export async function getListsOfUser(client, { userId }) {
  const res = await client.query("SELECT * FROM flashcard_lists WHERE user_id=$1", [userId]);
  return res.rows;
}

export async function deleteList(client, {listId}) {
    const res = await client.query(
        "DELETE FROM flashcard_lists WHERE id=$1 RETURNING *",
        [listId]
    );
    return res.rows[0];
}

