import * as admin from "firebase-admin";

const app = admin.initializeApp();
export const db = app.firestore();
export { default as SendMail } from "./mail";
