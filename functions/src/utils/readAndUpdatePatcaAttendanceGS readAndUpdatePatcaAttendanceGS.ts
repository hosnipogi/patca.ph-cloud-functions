import { https, logger } from "firebase-functions/v1";
import { google } from "googleapis";
import getCurrentDay from "./getCurrentDay";

enum SpreadSheetColumn {
  DAY0 = "H",
  DAY1 = "I",
  DAY2 = "J",
  DAY3 = "K",
}

const sheetName = "PatcaGuests";
const spreadsheetId = process.env.PATCA_MEMBER_MASTERLIST_SPREADSHEET_ID!;

const readAndUpdatePatcaAttendanceGS = async (
  memberId: string,
  setPresent = false
) => {
  const d = getCurrentDay();
  if (d === -1 || d === -2) {
    logger.error("Event not active");
    throw new https.HttpsError("internal", "Event not active");
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: "./credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const request = {
    auth,
    spreadsheetId,
  };

  const {
    data: { valueRanges },
    status,
  } = await googleSheets.spreadsheets.values.batchGetByDataFilter({
    ...request,
    requestBody: {
      majorDimension: "COLUMNS",
      dataFilters: [
        {
          a1Range: `${sheetName}!A:K`,
        },
      ],
    },
  });

  if (status !== 200) throw new Error("Something wrong happened in sheets");
  if (!valueRanges?.length) throw new Error("Empty");
  const parentValues = valueRanges[0].valueRange?.values;
  if (!parentValues?.length) throw new Error("Empty");
  const values = parentValues[0] as string[];

  let row = values.findIndex((id) => id === memberId);
  if (row < 0) {
    throw new Error(
      `From update google sheets: Member id ${memberId} Not found`
    );
  }

  if (setPresent) {
    row = row + 1; // 1 index
    const response = await googleSheets.spreadsheets.values.update({
      ...request,
      range: `${sheetName}!${SpreadSheetColumn[`DAY${d}`]}${row}:${
        SpreadSheetColumn[`DAY${d}`]
      }${row}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toUTCString()]],
      },
    });
    if (response.status !== 200) {
      throw new https.HttpsError(
        "internal",
        `Something's wrong updating GS, id-${memberId}`
      );
    }
    return response?.status;
  }

  const query = {
    id: values[row],
    name: parentValues[1][row],
    wiresign: parentValues[2][row],
    d0: parentValues[3][row],
    d1: parentValues[4][row],
    d2: parentValues[5][row],
    d3: parentValues[6][row],
  };

  return query;
};

export default readAndUpdatePatcaAttendanceGS;
