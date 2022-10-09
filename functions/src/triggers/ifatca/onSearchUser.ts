import { https, logger } from "firebase-functions";
import { FirebaseConfig } from "../../types/enums";
import { db, corsHandler, throwOnInvalidAuth } from "../../utils";

export default https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      throwOnInvalidAuth(request.get("Authorization"));
      const id = request.query.id;
      if (!id) throw new Error("ID Not found");

      const query = await db
        .collection(FirebaseConfig.COLLECTION_NAME)
        .doc(String(id))
        .get();

      if (!query.exists) {
        response.status(404).send("Not found");
        return;
      }

      const data = query.data();
      response.send(data);
    } catch (error) {
      logger.error("Search user error", (error as Error).message);
      response.status(401).send((error as Error).message);
    }
    return;
  });
});
