import csv from "csv-parser";
import { Readable } from "stream";

export const parseCSVBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};
