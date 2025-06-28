import mongoose from "mongoose";

const PreferenceSchema = new mongoose.Schema({
  email: { type: String, required: true },
  frequency: { type: String, required: true },
  message: { type: String, required: true },
});

const Preference = mongoose.models.Preference || mongoose.model("Preference", PreferenceSchema);

export default Preference;
