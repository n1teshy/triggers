import { Note } from "../models/note.js";
import { TextField } from "hades";

export const noteSchema = {
  title: new TextField("Title").require(),
  content: new TextField("Content"),
};

export const userSchema = {
  username: new TextField("Username").require().test(async function (username) {
    const exists = await Note.exists({ username });
    return !exists;
  }),
  name: {
    first: new TextField("First name").require(),
    last: new TextField("Last name"),
  },
};
