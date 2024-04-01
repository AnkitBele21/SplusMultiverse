import { Request, Response } from "express";
import {
  endTimeColumnName,
  snookerPlusSheetFrames,
  startTimeColName,
  tableNumberColName,
  tableTurnOffColName,
  tableTurnOnColName,
} from "../../constants/sheetConstants";
const googleSheet = require("../../helpers/google-sheet");

export const updateFrameData = async (req: Request, res: Response) => {
  try {
    // Parse the request body for JSON data
    const payload = req.body;

    // Extract data from the payload
    const frameId = payload.frameId;
    const tableNo = payload.tableNo;
    const startTime = payload.startTime;
    const players = payload.players.map((player: string) => player.trim());

    // Calculate the row number from the frameId
    // Assuming frameId format is "SPS<number>"
    const rowNumber = parseInt(frameId.replace("SPS", ""));
    const resp = await googleSheet.update(
      `${snookerPlusSheetFrames}!${startTimeColName}${rowNumber}`,
      [[startTime]]
    );

    const resp1 = await googleSheet.update(
      `${snookerPlusSheetFrames}!${tableNumberColName}${rowNumber}`,
      [[tableNo]]
    );

    const colsMapping = ["M", "N", "O", "P", "Q", "R"];

    colsMapping.map( async(val, i) => {
      const resp_01 = await googleSheet.update(
        `${snookerPlusSheetFrames}!${val}${rowNumber}`,
        [[players?.[i] || ""]]
      );
    })

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating frame:", error);
    res.status(500).json({ success: false, error: "Failed to update frame" });
  }
};

export const turnOffFrame = async (req: Request, res: Response) => {
  try {
    // Parse the request body for JSON data
    const payload = req.body;

    // Extract data from the payload
    const frameId = payload.frameId;
    const endTime = new Date();
    const options = { hour12: false, timeZone: 'Asia/Calcutta'};
    const timeString = endTime.toLocaleTimeString(undefined, options);
    const players = payload.players.map((player: string) => player.trim());

    // Calculate the row number from the frameId
    // Assuming frameId format is "SPS<number>"
    const rowNumber = parseInt(frameId.replace("SPS", ""));

    const turnOffResp = await googleSheet.update(
      `${snookerPlusSheetFrames}!${tableTurnOffColName}${rowNumber}`,
      [["Off"]]
    );

    const endTimeResp = await googleSheet.update(
      `${snookerPlusSheetFrames}!${endTimeColumnName}${rowNumber}`,
      [[timeString]]
    );

    const colsMapping = [
      "X",
      "Y",
      "Z",
      "AA",
      "AB",
      "AC",
      "AD",
      "AE",
      "AF",
      "AG",
    ];

    // Update player names in columns M to R
    for (let i = 0; i < players.length; i++) {
      if (i > 9) {
        {
          break;
        }
      }
      const resp_01 = await googleSheet.update(
        `${snookerPlusSheetFrames}!${colsMapping[i]}${rowNumber}`,
        [[players[i]]]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating frame:", error);
    res.status(500).json({ success: false, error: "Failed to update frame" });
  }
};

export const turnOnFrame = async (req: Request, res: Response) => {
  try {
    // Parse the request body for JSON data
    const payload = req.body;

    const tableNo = payload.tableNo;
    const frameId = payload.frameId;
    const players = payload.players.map((player: string) => player.trim());

    const startTime = new Date();
    const options = { hour12: false, timeZone: 'Asia/Calcutta'};
    const timeString = startTime.toLocaleTimeString(undefined, options);

    // Calculate the row number from the frameId
    // Assuming frameId format is "SPS<number>"
    const rowNumber = parseInt(frameId.replace("SPS", ""));

    const turnOffResp = await googleSheet.update(
      `${snookerPlusSheetFrames}!${tableTurnOnColName}${rowNumber}`,
      [["On"]]
    );

    const resp1 = await googleSheet.update(
      `${snookerPlusSheetFrames}!${startTimeColName}${rowNumber}`,
      [[timeString]]
    );

    const resp2 = await googleSheet.update(
      `${snookerPlusSheetFrames}!${tableNumberColName}${rowNumber}`,
      [[tableNo]]
    );

    const colsMapping = ["M", "N", "O", "P", "Q", "R"];

    for (let i = 0; i < players.length; i++) {
      if (i > 5) {
        {
          break;
        }
      }
      const resp_01 = await googleSheet.update(
        `${snookerPlusSheetFrames}!${colsMapping[i]}${rowNumber}`,
        [[players[i]]]
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error creating frame:", error);
    res.status(500).json({ success: false, error: "Failed to update frame" });
  }
};
