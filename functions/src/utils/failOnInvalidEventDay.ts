import { logger, https } from "firebase-functions/v1";
import getCurrentDay from "./getCurrentDay";

export default function () {
  const dayNum = getCurrentDay();
  if (dayNum === -2) {
    logger.error("Event not yet live");
    throw new https.HttpsError("invalid-argument", "Event not yet live");
  } else if (dayNum === -1) {
    logger.error("IFATCA event ended");
    throw new https.HttpsError("invalid-argument", "IFATCA event ended");
  } else if (!dayNum) {
    logger.error("Event not yet live");
    throw new https.HttpsError("invalid-argument", "Event not yet live");
  }

  return dayNum;
}
