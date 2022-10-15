import { https, logger } from "firebase-functions";
import { FirebaseConfig } from "../../types/enums";
import { db } from "../../utils";
import verifyAuth from "../../utils/verifyAuth";
import getAttendance from "../../utils/readAndUpdatePatcaAttendanceGS readAndUpdatePatcaAttendanceGS";

export default https.onCall(async (data: string, context) => {
  const auth = context.auth;
  verifyAuth(auth);

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

  const latestData = await getAttendance(id);
  return latestData;
});
