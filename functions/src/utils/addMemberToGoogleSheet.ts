import { google } from "googleapis";
import { IRegistrationArgs } from "../types";

const addMemberToGoogleSheet = async (val: IRegistrationArgs) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  const rearranged: IRegistrationArgs & { date: string } = {
    date: new Date().toUTCString(),
    id: val.id,
    firstname: val.firstname,
    lastname: val.lastname,
    fullname: val.fullname,
    designation: val.designation,
    email: val.email,
    memberAssoc: val.memberAssoc,
    city: val.city,
    country: val.country,
    company: val.company,
    jobTitle: val.jobTitle,
    methodOfPayment: val.methodOfPayment,
    phoneNumber: `'${val.phoneNumber}'`,
    whatsApp: `'${val.whatsApp}'`,
  };

  const values = Object.values(
    rearranged
  ) as IRegistrationArgs[keyof IRegistrationArgs][];

  const res = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Members!A:O",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [values],
    },
  });

  if (res.status !== 200) throw new Error("Something wrong happened in sheets");

  return res;
};

export default addMemberToGoogleSheet;
