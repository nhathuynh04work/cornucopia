export async function getCardsOfList(client, {listId}) {
    const res = await client.query (
    "SELECT * FROM flashcards WHERE list_id=$1", [listId]
    );
    return res.rows;
}

export async function createCard(client, {listId, term = null, definition = null}) {
    const res = await client.query(
        "INSERT INTO flashcards (list_id, term, definition) VALUES ($1, $2, $3) RETURNING *",
        [listId, term, definition]
    );
    return res.rows[0];
}

export async function deleteCard(client, {cardId}) {
    const res = await client.query(
        "DELETE FROM flashcards WHERE id=$1 RETURNING *",
        [cardId]
    );
    return res.rows[0];
}
