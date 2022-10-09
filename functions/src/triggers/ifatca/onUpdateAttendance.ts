import { https, logger } from "firebase-functions";
import { FirebaseConfig } from "../../types/enums";
import {
  db,
  corsHandler,
  throwOnInvalidAuth,
  updateGoogleSheet,
} from "../../utils";
import getCurrentDay from "../../utils/getCurrentDay";

export default https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      throwOnInvalidAuth(request.get("Authorization"));
      const id = request.body.id;
      if (!id) throw new Error("Id is not provided");

      const query = db
        .collection(FirebaseConfig.COLLECTION_NAME)
        .doc(String(id));

      const exists = await query.get();

      if (!exists) {
        response.status(404).send("Not found");
        return;
      }

      const dayNum = getCurrentDay();
      if (!dayNum) throw new Error("Event not yet live");

      const res = await query.update({
        [`isPresentDay${dayNum}`]: true,
      });

      logger.info(`Updated attendance day${dayNum} - ${id}`, res);

      const gsheetResponse = await updateGoogleSheet(id, "attendance");
      if (gsheetResponse !== 200)
        throw new Error(`GSheet attendance error - ${id}`);

      response.send({ message: "Successfully updated attendance", dayNum });
    } catch (error) {
      logger.error("Search user error", (error as Error).message);
      response.status(401).send((error as Error).message);
    }
  });
});
