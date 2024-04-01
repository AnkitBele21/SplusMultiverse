import { snookerPlusSheetName, usernameColIndex } from "../constants/sheetConstants";

const googleSheet = require("./google-sheet");

export const getUserIndex = async (identifier: {
  username?: string;
  userId?: number;
}) => {
  if (identifier.userId) {
    return await getUserById(identifier.userId);
  }

  if (identifier.username) {
    return await getUserIdxByUsername(identifier.username);
  }

  throw new Error(
    `Invalid identifier To Get User: ${JSON.stringify(identifier)}`
  );
};

const getUserIdxByUsername = async (username: string) => {
  const response = await googleSheet.read(
    `${snookerPlusSheetName}!${String.fromCharCode(
      64 + usernameColIndex
    )}:${String.fromCharCode(64 + usernameColIndex)}`
  );
  const usernameList = response.map(
    (row: any) => row[0]?.toLowerCase() || row[0]
  );
  let userIdx = usernameList.indexOf(username.toLowerCase());
  if (userIdx === -1) {
    throw new Error(`User: ${username} not found`);
  }
  userIdx += 1;

  const userResponse = await googleSheet.read(
    // Reading upto column ZZ
    `${snookerPlusSheetName}!A${userIdx}:${
      String.fromCharCode(64 + 26) + String.fromCharCode(64 + 26)
    }${userIdx}`
  );
  const userDetails = userResponse[0];

  return { user: userDetails, idx: userIdx };
};

export const getUserById = (id: number) => {
  // TODO:
  throw new Error(`Method not implemented yet.`);
};
