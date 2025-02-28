import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
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
    active: this.active,
  };
  if(password) {
    trigger.password = this.password;
  }
  return trigger;
};

export const Trigger = mongoose.model("Trigger", noteSchema);
