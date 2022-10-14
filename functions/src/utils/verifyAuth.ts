import { https, logger } from "firebase-functions";
import { AuthData } from "firebase-functions/lib/common/providers/https";

const AUTHORIZED_USERS = process.env.AUTHORIZED_USERS!;

export default function verifyAuth(auth: AuthData | undefined) {
  const authorizedUsers = AUTHORIZED_USERS.split(",");
  if (auth?.token.email) {
    if (authorizedUsers.includes(auth.token.email)) {
      return;
    }
  }

  logger.error("Invalid credentials", auth);
  throw new https.HttpsError("permission-denied", `UNAUTHORIZED`);
}
