import { onRequest } from "../utils/request.js";
import { Trigger } from "../models/trigger.js";
import { makeResponse, statuses } from "../utils/response.js";
import { AppError } from "../utils/error.js";

function randomId() {
  const chars = "0123456789abcdef";
  let hexId = "";
  for (let i = 0; i < 24; i++) {
    hexId += chars[Math.floor(Math.random() * chars.length)];
  }
  return hexId;
}

exports.handler = async (req) => {
  try {
    const handler = handlers.find((item) => new RegExp(item[0]).test(req.path));
    if (handler) {
      return await handler[1](req);
    } else {
      throw new AppError(statuses.NOT_FOUND, "Naw son, dat path ain't here.");
    }
  } catch (error) {
    return makeResponse({ message: error.message }, error.status || 500);
  }
};

async function triggers(req) {
  const method = req.httpMethod;
  if (method === "OPTIONS") {
    return makeResponse({}, 200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    });
  }
  if (method !== "GET" && method !== "POST") {
    throw new AppError(statuses.BAD_REQUEST, `Nah bro, wrong method ${method}`);
  }
  await onRequest(req);
  if (method == "POST") {
    const trigger = new Trigger({ password: randomId() });
    return makeResponse(trigger.toJSON(true), 200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    });
  }
  const triggers = await Trigger.find()
    .skip(req.queries.skip ?? 0)
    .limit(req.queries.limit ?? 1000);
  return makeResponse(
    triggers.map((trigger) => {
      return trigger.toJSON();
    })
  );
}

async function trigger(req) {
  const method = req.httpMethod;
  if (method !== "GET" && method !== "POST" && method !== "DELETE") {
    throw AppError(statuses.UNPROCESSABLE, "wrong method fam.");
  }
  await onRequest(req);
  const triggerId = req.path.replace(/\/$/, "").split("/").at(-1);
  if (method === "GET") {
    const trigger = await Trigger.findById(triggerId);
    if (trigger) {
      return trigger.toJSON();
    }
    return makeResponse(
      { message: "Nah, I ain't know where that is." },
      statuses.NOT_FOUND
    );
  } else if (method == "POST") {
    const updated = await Note.findByIdAndUpdate(
      triggerId,
      { active: true },
      {
        new: true,
      }
    );
    return makeResponse({ active: updated.active });
  }
  const password = !req.body?.password;
  const trigger = Trigger.findById(triggerId);
  
  if (!trigger) {
    return makeResponse(
      { message: "Nah, I ain't know where that is." },
      statuses.NOT_FOUND
    );
  }
  if (!password || password !== trigger.password) {
    return makeResponse(
      { message: "You ain't authorized for these streets lil bro." },
      statuses.UNAUTHORIZED
    );
  }
  await Trigger.findByIdAndDelete(triggerId);
  return makeResponse({ message: "deleted" });
}

const handlers = [
  ["/.netlify/functions/triggers/?$", triggers],
  ["/.netlify/functions/triggers/[A-Fa-f0-9]{24}/?$", trigger],
];
