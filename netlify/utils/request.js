import { decrypt } from "./crypt.js";
import { connectDB } from "./db.js";
import { AppError } from "./error.js";
import { statuses } from "./response.js";

export async function onRequest(req, secure = false) {
  req.body = req.body ? JSON.parse(req.body) : {};
  req.queries = Object.fromEntries(
    req.rawQuery.split("&").map((query) => query.split("="))
  );
  if (req.headers.authorization) {
    req.user = JSON.parse(decrypt(req.headers.authorization));
  } else if (secure) {
    throw new AppError(
      statuses.UNAUTHORIZED,
      "Nah bro, you ain't authorized for these streets."
    );
  }
  await connectDB();
}
