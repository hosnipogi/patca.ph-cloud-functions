import * as functions from "firebase-functions";
import { db } from "./utils";
import { FirebaseConfig } from "./types/enums";
import { SendMail } from "./utils";

const AUTH_KEY = process.env.AUTH_KEY;

export const registerAprmDelegate = functions.https.onRequest(
  async (request, response) => {
    try {
      if (request.headers.authorization !== `Bearer ${AUTH_KEY}`)
        throw new Error("Unauthorized Access");
      const body = request.body;
      const res = await db.collection(FirebaseConfig.COLLECTION_NAME).add(body);
      if (!res.id) throw new Error("No ID generated");
      functions.logger.info(res.id);

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

export const searchUser = functions.https.onRequest(
  async (request, response) => {
    try {
      if (request.headers.authorization !== `Bearer ${AUTH_KEY}`)
        throw new Error("Unauthorized Access");
      const id = request.query.id;

      if (!id) throw new Error("ID Not found");

      const query = await db
        .collection(FirebaseConfig.COLLECTION_NAME)
        .doc(String(id))
        .get();

      response.send(query);
    } catch (error) {
      functions.logger.error("Search user error", (error as Error).message);
      response.status(401).send((error as Error).message);
    }

    return;
  }
);

export const sendMailOnCreate = SendMail;
