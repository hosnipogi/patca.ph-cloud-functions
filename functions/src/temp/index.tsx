import guests from "../triggers/patca/guests";
import { FirebaseConfig } from "../types/enums";
import { db } from "../utils";
import googleSheetBatchUpdate from "./googleSheet";

async function ccc() {
  try {
    const persisted = guests.map(async (guest) => {
      const data = {
        name: guest.name,
        wiresign: guest.wiresign,
      };
      const { id } = await db
        .collection(FirebaseConfig.PATCA_COLLECTION_NAME)
        .add(data);

      return {
        id,
        wiresign: guest.wiresign,
        name: guest.name,
        day0: guest.day0,
        day1: guest.day1,
        day2: guest.day2,
        day3: guest.day3,
      };
    });

    const resolvedGuests = await Promise.all(persisted);
    await googleSheetBatchUpdate(resolvedGuests);
  } catch (e) {
    console.log((e as Error).message);
  }

  return "Success";
}

ccc().then(console.log).catch(console.log);
