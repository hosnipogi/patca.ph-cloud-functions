import { https, logger } from "firebase-functions";
import { FirebaseConfig } from "../../types/enums";
import { db, corsHandler, throwOnInvalidAuth } from "../../utils";

export default https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      throwOnInvalidAuth(request.get("Authorization"));
      const id = request.body.id;

      if (!id) throw new Error("ID Not found");

      const query = db
        .collection(FirebaseConfig.COLLECTION_NAME)
        .doc(String(id));

      const exists = await query.get();

      if (!exists) {
        response.status(404).send("Not found");
        return;
      }

      const res = await query.update({
        receivedSouvenir: true,
      });

      logger.info(`Updated souvenirs - ${id}`, res);
      response.send("Updated Received Souvenir - SUCCESS");
    } catch (error) {
      logger.error("Search user error", (error as Error).message);
      response.status(401).send((error as Error).message);
    }
    return;
  });
});
