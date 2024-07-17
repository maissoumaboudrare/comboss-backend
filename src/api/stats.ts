import { Hono } from 'hono';
import { getCharacterStats } from '../models/stat.model';

const stats = new Hono();

stats.get('/:characterID', async (c) => {
  const characterID = parseInt(c.req.param("characterID"), 10);
  if (!characterID) {
    return c.json({ error: 'Character ID is required' }, 400);
  }

  try {
    const stats = await getCharacterStats(characterID);
    return c.json(stats);
  } catch (error) {
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

export default stats;