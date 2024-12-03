import { Router } from 'express';

import packageJson from '../package.json';
import { HabitsController } from './controller/controller.habits';

export const routes = Router();

const habitsController = new HabitsController();

routes.get('/', (request, response) => {
  const { name, description, version } = packageJson;
  return response.status(200).json({ name, description, version });
});

routes.post('/habits', habitsController.store);
