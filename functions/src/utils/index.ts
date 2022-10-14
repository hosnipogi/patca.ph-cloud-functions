import * as admin from "firebase-admin";

const app = admin.initializeApp({
  projectId: "patca-aprm",
});
export const db = app.firestore();
db.settings({
  ignoreUndefinedProperties: true,
});
export { default as sendMail } from "./mail";
export { default as addMemberToGoogleSheet } from "./addMemberToGoogleSheet";
export { default as corsHandler } from "./corsHandler";
export { default as throwOnInvalidAuth } from "./throwOnInvalidAuth";
export { default as updateGoogleSheet } from "./updateGoogleSheet";
