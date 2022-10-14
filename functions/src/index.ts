import * as functions from "firebase-functions";
import { db, sendMail, addMemberToGoogleSheet } from "./utils";
import { FirebaseConfig } from "./types/enums";
import { IRegistrationArgs } from "./types";

const AUTH_KEY = process.env.AUTH_KEY;

export const registerAprmDelegate = functions.https.onRequest(
  async (request, response) => {
    try {
      if (request.headers.authorization !== `Bearer ${AUTH_KEY}`)
        throw new Error("Unauthorized Access");
      const body = request.body;
      const res = await db.collection(FirebaseConfig.COLLECTION_NAME).add(body);
      if (!res.id) throw new Error("No ID generated");
      functions.logger.info("New member registered", res.id);

      response.send(res.id);
    } catch (error) {
      functions.logger.error("registeredAprmDelegate func error", error);
      response.status(401).send((error as Error).message);
    }

    return;
  }
);

export const isUnregisteredEmail = functions.https.onRequest(
  async (request, response) => {
    try {
      if (request.headers.authorization !== `Bearer ${AUTH_KEY}`)
        throw new Error("Unauthorized Access");
      const { email } = request.body;
      const query = db
        .collection(FirebaseConfig.COLLECTION_NAME)
        .where("email", "==", email);

      const isUnregistered = await query.get();

      response.send(isUnregistered.empty);
    } catch (error) {
      functions.logger.error((error as Error).message);
      response.status(401).send((error as Error).message);
    }
    return;
  }
);

export const sendMailAndUpdateSheetOnCreate = functions.firestore
  .document(`${FirebaseConfig.COLLECTION_NAME}/{userId}`)
  .onCreate((snap) => {
    const data = snap.data();
    const id = snap.id;

    const newMember = { ...data, id } as IRegistrationArgs;

    addMemberToGoogleSheet(newMember);
    sendMail(newMember);

    functions.logger.info(
      "Send email and update sheets completed for new member",
      {
        id,
        email: newMember.email,
      }
    );

    return true;
  });

export * from "./triggers/ifatca";
// export * from "./triggers/patca";
