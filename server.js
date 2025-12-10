const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'words.json');
function readData(){
  try{
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  }catch(e){
    return [];
  }
}
function writeData(list){
  try{
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
    return true;
  }catch(e){
    console.error('writeData error', e);
    return false;
  }
}

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/words  -> optional query ?active=true
app.get('/api/words', (req, res) => {
  const all = readData();
  const { active } = req.query;
  if (active === 'true'){
    return res.json(all.filter(w => w.active));
  }
  res.json(all);
});

// POST /api/words -> add new word
app.post('/api/words', (req, res) => {
  const { word, pos, def, sample } = req.body || {};
  if (!word || !def) return res.status(400).json({ error: 'word and def required' });
  const list = readData();
  const id = (list.reduce((m, x) => Math.max(m, x.id||0), 0) || 0) + 1;
  const item = { id, word, pos: pos||'', def, sample: !!sample, active: true };
  list.push(item);
  if (!writeData(list)) return res.status(500).json({ error: 'failed to save' });
  res.status(201).json(item);
});

// PUT /api/words/:id -> update
app.put('/api/words/:id', (req, res) => {
  const id = Number(req.params.id);
  const list = readData();
  const idx = list.findIndex(w => Number(w.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const updated = Object.assign({}, list[idx], req.body);
  list[idx] = updated;
  if (!writeData(list)) return res.status(500).json({ error: 'failed to save' });
  res.json(updated);
});

// DELETE /api/words/:id
app.delete('/api/words/:id', (req, res) => {
  const id = Number(req.params.id);
  let list = readData();
  const idx = list.findIndex(w => Number(w.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const removed = list.splice(idx,1)[0];
  if (!writeData(list)) return res.status(500).json({ error: 'failed to save' });
  res.json(removed);
});

// simple static serve for frontend files (optional)
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log('Server running on port', PORT);
});
