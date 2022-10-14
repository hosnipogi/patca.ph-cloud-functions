import { https, logger } from "firebase-functions";
import { FirebaseConfig } from "../../types/enums";
import { db, updateGoogleSheet } from "../../utils";
import failOnInvalidEventDay from "../../utils/failOnInvalidEventDay";
import verifyAuth from "../../utils/verifyAuth";

export default https.onCall(async (data, context) => {
  const { auth } = context;
  verifyAuth(auth);
  failOnInvalidEventDay();

  const id = data;
  if (!id) throw new Error("ID Not found");

  const query = db.collection(FirebaseConfig.COLLECTION_NAME).doc(String(id));
  const exists = await query.get();
  if (!exists) {
    const errMessage = `userId-${id} does not exist`;
    logger.error(errMessage);
    throw new https.HttpsError("not-found", errMessage);
  }

  const res = await query.update({
    isPaid: true,
  });

  logger.info(`Updated payment - ${id}`, res);

  const gsheetResponse = await updateGoogleSheet(id, "payment");
  if (gsheetResponse !== 200) {
    logger.info("GSheet error", id);
    throw new https.HttpsError("internal", `GSheet attendance error - ${id}`);
  }

  return "SUCCESS";
});
