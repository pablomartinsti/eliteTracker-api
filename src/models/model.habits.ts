import { Schema, model } from 'mongoose';

const HabitSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    completedDate: {
      type: [Date],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const habitModel = model('Habit', HabitSchema);
