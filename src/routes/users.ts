import { Router, Request, Response } from 'express';
import { Model, ModelStatic } from 'sequelize';
import db from '../models';

const router = Router();
const User = db['User'] as ModelStatic<Model>;

router.get('/', async (_req: Request, res: Response) => {
  const users = await User.findAll();
  res.json(users);
});

router.get('/:id', async (req: Request, res: Response) => {
  const user = await User.findByPk(String(req.params['id']));
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json(user);
});

export default router;
