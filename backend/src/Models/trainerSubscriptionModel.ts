import mongoose, { Schema } from "mongoose";
import { ITrainerSubscription } from "../types/trainerSubscriptionTypes.js";

const trainerSubscriptionSchema = new Schema<ITrainerSubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  trainerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planType: {
    type: String,
    enum: ["monthly", "quarterly", "yearly"],
    required: true,
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: false },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

trainerSubscriptionSchema.pre("save", function (this: ITrainerSubscription, next) {
  if (!this.startDate) {
    this.startDate = new Date();
  }

  if (!this.endDate) {
    let monthsToAdd = 0;
    switch (this.planType) {
      case "monthly":
        monthsToAdd = 1;
        break;
      case "quarterly":
        monthsToAdd = 3;
        break;
      case "yearly":
        monthsToAdd = 12;
        break;
    }

    const start = new Date(this.startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + monthsToAdd);

    this.endDate = end;
  }

  next();
});

const TrainerSubscriptionModel = mongoose.model<ITrainerSubscription>(
  "TrainerSubscription",
  trainerSubscriptionSchema
);

export default TrainerSubscriptionModel;
