import dayjs from 'dayjs';
import { type Request, type Response } from 'express';
import { z } from 'zod';

import { habitModel } from '../models/model.habits';
import { buildValidationErrorMessage } from '../utils/build-validation-error-message.util';

export class HabitsController {
  store = async (request: Request, response: Response): Promise<Response> => {
    const schema = z.object({
      name: z.string(),
    });

    const habit = schema.safeParse(request.body);

    if (!habit.success) {
      const erros = buildValidationErrorMessage(habit.error.issues);

      return response.status(422).json({ message: erros });
    }
    const findHabit = await habitModel.findOne({
      name: habit.data.name,
    });

    if (findHabit) {
      return response.status(400).json({ message: 'Habit already exists' });
    }

    const newHabit = await habitModel.create({
      name: habit.data.name,
      completedDate: [],
    });

    return response.status(201).json(newHabit);
  };

  index = async (request: Request, response: Response) => {
    const habits = await habitModel.find().sort({ name: 1 });
    return response.status(201).json(habits);
  };

  remove = async (request: Request, response: Response) => {
    const schema = z.object({
      id: z.string(),
    });
    const habit = schema.safeParse(request.params);

    if (!habit.success) {
      const erros = buildValidationErrorMessage(habit.error.issues);

      return response.status(422).json({ message: erros });
    }
    const findHabit = await habitModel.findOne({
      _id: habit.data.id,
    });

    if (!findHabit) {
      return response.status(422).json({ message: 'habit not found' });
    }

    await habitModel.deleteOne({
      _id: habit.data.id,
    });
    return response.status(204).send();
  };

  toggle = async (request: Request, response: Response) => {
    const schema = z.object({
      id: z.string(),
    });
    const validated = schema.safeParse(request.params);

    if (!validated.success) {
      const erros = buildValidationErrorMessage(validated.error.issues);

      return response.status(422).json({ message: erros });
    }
    const findHabit = await habitModel.findOne({
      _id: validated.data.id,
    });

    if (!findHabit) {
      return response.status(422).json({ message: 'habit not found' });
    }

    const now = dayjs().startOf('day').toISOString();

    const isHabitCompletedOnDate = findHabit
      .toObject()
      ?.completedDate.find((item) => dayjs(String(item)).toISOString() === now);

    if (isHabitCompletedOnDate) {
      const habitUpdated = await habitModel.findByIdAndUpdate(
        {
          _id: validated.data.id,
        },
        {
          $pull: {
            completedDate: now,
          },
        },
        {
          returnDocument: 'after',
        },
      );
      return response.status(200).json(habitUpdated);
    }

    const habitUpdated = await habitModel.findByIdAndUpdate(
      {
        _id: validated.data.id,
      },
      {
        $push: {
          completedDate: now,
        },
      },
      {
        returnDocument: 'after',
      },
    );

    return response.json(habitUpdated);
  };
}
