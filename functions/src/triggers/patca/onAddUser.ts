import { https } from "firebase-functions/v1";
import { FirebaseConfig } from "../../types/enums";
import { db } from "../../utils";
import guests from "./guests";

// SHOULD BE USED ONLY ONCE TO POPULATE FIRESTORE

const onAddUser = https.onRequest(async (request, response) => {
  const bb = guests.map(async (guest) => {
    const { id } = await db
      .collection(FirebaseConfig.PATCA_COLLECTION_NAME)
      .add(guest);

    return { id, ...guest };
  });

  Promise.all(bb).then((i) => {
    response.send(i);
  });
});

export default onAddUser;
