import { https, logger } from "firebase-functions";
import { FirebaseConfig } from "../../types/enums";
import { db } from "../../utils";
import getCurrentDay from "../../utils/getCurrentDay";
import verifyAuth from "../../utils/verifyAuth";
import getAttendance from "../../utils/readAndUpdatePatcaAttendanceGS readAndUpdatePatcaAttendanceGS";

export default https.onCall(async (data: string, context) => {
  const auth = context.auth;
  verifyAuth(auth);
  const dayNum = getCurrentDay();
  if (dayNum === -1 || dayNum === -2) {
    const message = "Event not live";
    logger.error(message);
    throw new https.HttpsError("unavailable", message);
  }

  const id = data;
  if (!id) {
    logger.error("No ID found");
    throw new https.HttpsError("not-found", "no ID found");
  }

  const query = await db
    .collection(FirebaseConfig.PATCA_COLLECTION_NAME)
    .doc(String(id))
    .get();

  if (!query.exists) {
    const errMessage = `userId-${id} does not exist`;
    logger.error(errMessage);
    throw new https.HttpsError("not-found", errMessage);
  }

  const message = await getAttendance(id, true);

  return {
    message,
    dayNum,
  };
});
