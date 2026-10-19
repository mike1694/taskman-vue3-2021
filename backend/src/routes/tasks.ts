import { Router, Request, Response } from 'express';
import initDb, { save } from '../db';
import type { TaskItem } from '../types';

const router = Router();

// GET / — get all tasks
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    const result = db.exec('SELECT * FROM tasks ORDER BY id DESC');
    const tasks: TaskItem[] = result.length > 0
      ? result[0].values.map((row: any) => ({
          id: row[0] as number,
          label: row[1] as string,
          type: row[2] as string,
          created: row[3] as string,
          info: row[4] as string | null,
          maxDate: row[5] as string | null,
          maxTime: row[6] as string | null,
          reopen: Boolean(row[7]),
          timer: Boolean(row[8]),
          closed: Boolean(row[9]),
          result: row[10] as string | null,
          closed_date: row[11] as string | null,
        }))
      : [];
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /task/create — create a new task
router.post('/task/create', async (req: Request, res: Response) => {
  try {
    const task: TaskItem = req.body;
    const db = await initDb();
    db.run(
      `INSERT INTO tasks (label, type, created, info, maxDate, maxTime, reopen, timer, closed, result, closed_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.label,
        task.type || 'normal',
        task.created,
        task.info || null,
        task.maxDate || null,
        task.maxTime || null,
        task.reopen ? 1 : 0,
        task.timer ? 1 : 0,
        task.closed ? 1 : 0,
        task.result || null,
        task.closed_date || null,
      ]
    );
    const result = db.exec('SELECT last_insert_rowid()');
    const id = result[0].values[0][0] as number;
    save();
    res.json({ ok: true, id });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// POST /task/update — update an existing task
router.post('/task/update', async (req: Request, res: Response) => {
  try {
    const task: TaskItem = req.body;
    const db = await initDb();
    db.run(
      `UPDATE tasks SET label=?, type=?, info=?, maxDate=?, maxTime=?, reopen=?, timer=?, closed=?, result=?, closed_date=?
       WHERE id=?`,
      [
        task.label,
        task.type || 'normal',
        task.info || null,
        task.maxDate || null,
        task.maxTime || null,
        task.reopen ? 1 : 0,
        task.timer ? 1 : 0,
        task.closed ? 1 : 0,
        task.result || null,
        task.closed_date || null,
        task.id,
      ]
    );
    save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// POST /task/delete — delete a task
router.post('/task/delete', async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const db = await initDb();
    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
