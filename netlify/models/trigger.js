import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
  },
}, { timestamp: true });

noteSchema.methods.toJSON = function (password = false) {
  const trigger = {
    id: this._id.toString(),
    name: this.name,
    active: this.active,
  };
  if(password) {
    trigger.password = this.password;
  }
  return trigger;
};

export const Trigger = mongoose.model("Trigger", noteSchema);
