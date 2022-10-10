import { google } from "googleapis";
import getCurrentDay from "./getCurrentDay";

enum SpreadSheetColumn {
  IS_PAID = "P",
  SOUVENIR = "Q",
  DAY1 = "R",
  DAY2 = "S",
  DAY3 = "T",
}

const updateGoogleSheet = async (
  memberId: string,
  updateMethod: "payment" | "attendance" | "souvenir"
) => {
  const d = getCurrentDay();
  if (!d) throw new Error("Error updating google sheet, event not yet live");

  const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = process.env.SPREADSHEET_ID!;

  const request = {
    auth,
    spreadsheetId,
  };

  const {
    data: { valueRanges },
    status,
  } = await googleSheets.spreadsheets.values.batchGet({
    ...request,
    valueRenderOption: "FORMATTED_VALUE",
    majorDimension: "COLUMNS",
    ranges: ["Members!B:B"],
  });

  if (status !== 200) throw new Error("Something wrong happened in sheets");
  if (!valueRanges?.length) throw new Error("Empty");
  const parentValues = valueRanges[0].values;
  if (!parentValues?.length) throw new Error("Empty");
  const values = parentValues[0] as string[];

  let row = values.findIndex((id) => id === memberId);
  if (row < 0)
    throw new Error(
      `From update google sheets: Member id ${memberId} Not found`
    );

  row = row + 1; // 1 index
  let response;

  switch (updateMethod) {
    case "payment": {
      response = await googleSheets.spreadsheets.values.update({
        ...request,
        range: `Members!${SpreadSheetColumn.IS_PAID}${row}:${SpreadSheetColumn.IS_PAID}${row}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[true]],
        },
      });
      break;
    }
    case "souvenir": {
      response = await googleSheets.spreadsheets.values.update({
        ...request,
        range: `Members!${SpreadSheetColumn.SOUVENIR}${row}:${SpreadSheetColumn.SOUVENIR}${row}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[true]],
        },
      });
      break;
    }
    case "attendance": {
      response = await googleSheets.spreadsheets.values.update({
        ...request,
        range: `Members!${SpreadSheetColumn[`DAY${d}`]}${row}:${
          SpreadSheetColumn[`DAY${d}`]
        }${row}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[new Date().toUTCString()]],
        },
      });
      break;
    }
    default:
      break;
  }

  return response?.status;
};

export default updateGoogleSheet;
