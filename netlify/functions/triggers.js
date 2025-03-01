import { onRequest } from "../utils/request.js";
import { Trigger } from "../models/trigger.js";
import { makeResponse, statuses } from "../utils/response.js";
import { AppError } from "../utils/error.js";
import mongoose from "mongoose";

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
    const name = req.body?.name;
    const triggerData = { password: randomId() };
    if (name) {
      const exists = await Trigger.exists({ name: name });
      if (exists) {
        return makeResponse(
          { message: "Somebody else got that name before you bro, you late." },
          statuses.UNPROCESSABLE
        );
      }
      triggerData.name = name;
    }
    const trigger = await Trigger.create(triggerData);
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
  if (
    method !== "GET" &&
    method !== "POST" &&
    method !== "PUT" &&
    method !== "DELETE"
  ) {
    throw new AppError(statuses.UNPROCESSABLE, "wrong method fam.");
  }
  await onRequest(req);
  const triggerId = req.path.replace(/\/$/, "").split("/").at(-1);
  let trigger = await Trigger.findOne({name: triggerId})
  if (!trigger && mongoose.Types.ObjectId.isValid(triggerId)) {
    trigger = await Trigger.findById(triggerId);
  }
  if (!trigger) {
    return makeResponse(
      { message: "Nah, I ain't know that trigger." },
      statuses.NOT_FOUND
    );
  }
  if (method === "GET") {
    return makeResponse(trigger.toJSON());
  } else if (method == "POST") {
    trigger.active = true;
    await trigger.save();
    return makeResponse({ active: trigger.active });
  } else if (method === "PUT") {
    trigger.active = false;
    await trigger.save();
    return makeResponse({ active: trigger.active });
  }
  const password = req.body?.password;
  if (!password || password !== trigger.password) {
    return makeResponse(
      { message: "You ain't authorized for these streets lil bro." },
      statuses.UNAUTHORIZED
    );
  }
  await Trigger.findByIdAndDelete(trigger._id.toString());
  return makeResponse({ message: "deleted" });
}

const handlers = [
  ["/.netlify/functions/triggers/?$", triggers],
  ["/.netlify/functions/triggers/[^/]+/?$", trigger],
];
