import { google } from "googleapis";

const SPREADSHEET_ID = "12tl1B-wQ6Cu9q4LDZxGsM184ItaGNy57AeqzpzR7RxQ";

type GuestType = {
  id: string;
  name: string;
  wiresign?: string;
  day0?: string;
  day1?: string;
  day2?: string;
  day3?: string;
};

const addMemberToGoogleSheet = async (guests: GuestType[]) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "../../credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = SPREADSHEET_ID;

  const data = guests.map((fields, idx) => {
    const bb = idx + 2;
    const values = [
      [
        fields.id,
        fields.name,
        fields.wiresign,
        fields.day0,
        fields.day1,
        fields.day2,
        fields.day3,
      ],
    ];
    return {
      range: `PATCAGuests!A${bb}:G${bb}`,
      values,
    };
  });

  const request = {
    auth,
    spreadsheetId,
  };

  const res = await googleSheets.spreadsheets.values.batchUpdate({
    ...request,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data,
    },
  });

  if (res.status !== 200) throw new Error("Something wrong happened in sheets");

  return res;
};

export default addMemberToGoogleSheet;
