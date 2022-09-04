import * as admin from "firebase-admin";

const app = admin.initializeApp();
export const db = app.firestore();
export { default as sendMail } from "./mail";
export { default as addMemberToGoogleSheet } from "./addMemberToGoogleSheet";
