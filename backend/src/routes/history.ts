import { Router, Request, Response } from 'express';
import initDb, { save } from '../db';
import type { HistoryItem } from '../types';

const router = Router();

// GET /get/history — get all history
router.get('/get/history', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    const result = db.exec('SELECT * FROM history ORDER BY id DESC');
    const items: HistoryItem[] = result.length > 0
      ? result[0].values.map((row: any) => ({
          id: row[0] as number,
          label: row[1] as string,
          type: row[2] as string,
          text: row[3] as string,
          path: row[4] as string,
          date: row[5] as string,
          song_length: row[6] as string | null,
          status: row[7] as string,
          created: row[8] as string,
        }))
      : [];
    res.json(items);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// POST /history/create — create a new history item
router.post('/history/create', async (req: Request, res: Response) => {
  try {
    const item: HistoryItem = req.body;
    const db = await initDb();
    db.run(
      `INSERT INTO history (label, type, text, path, date, song_length, status, created)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.label,
        item.type || 'log',
        item.text,
        item.path || '',
        item.date,
        item.song_length || null,
        item.status || 'in_process',
        item.created,
      ]
    );
    const result = db.exec('SELECT last_insert_rowid()');
    const id = result[0].values[0][0] as number;
    save();
    res.json({ ok: true, id });
  } catch (err) {
    console.error('Error creating history item:', err);
    res.status(500).json({ error: 'Failed to create history item' });
  }
});

// POST /history/update — update an existing history item
router.post('/history/update', async (req: Request, res: Response) => {
  try {
    const item: HistoryItem = req.body;
    const db = await initDb();
    db.run(
      `UPDATE history SET label=?, type=?, text=?, path=?, date=?, song_length=?, status=?
       WHERE id=?`,
      [
        item.label,
        item.type || 'log',
        item.text,
        item.path || '',
        item.date,
        item.song_length || null,
        item.status || 'in_process',
        item.id,
      ]
    );
    save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error updating history item:', err);
    res.status(500).json({ error: 'Failed to update history item' });
  }
});

// POST /history/delete — delete a history item
router.post('/history/delete', async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const db = await initDb();
    db.run('DELETE FROM history WHERE id = ?', [id]);
    save();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting history item:', err);
    res.status(500).json({ error: 'Failed to delete history item' });
  }
});

export default router;
