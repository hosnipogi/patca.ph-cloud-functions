import { https, logger } from "firebase-functions";
import { FirebaseConfig } from "../../types/enums";
import { db, updateGoogleSheet } from "../../utils";
import failOnInvalidEventDay from "../../utils/failOnInvalidEventDay";
import verifyAuth from "../../utils/verifyAuth";

export default https.onCall(async (data, context) => {
  const { auth } = context;
  verifyAuth(auth);
  const dayNum = failOnInvalidEventDay();

  const id = data;
  if (!id) throw new Error("Id is not provided");

  const query = db.collection(FirebaseConfig.COLLECTION_NAME).doc(String(id));
  const exists = await query.get();

  if (!exists) {
    const errMessage = `userId-${id} does not exist`;
    logger.error(errMessage);
    throw new https.HttpsError("not-found", errMessage);
  }

  const res = await query.update({
    [`isPresentDay${Number(dayNum)}`]: true,
  });

  logger.info(`Updated attendance day${dayNum} - ${id}`, res);

  const gsheetResponse = await updateGoogleSheet(id, "attendance");
  if (gsheetResponse !== 200) {
    logger.info("GSheet error", id);
    throw new https.HttpsError("internal", `GSheet attendance error - ${id}`);
  }

  return { message: "Successfully updated attendance", dayNum };
});
