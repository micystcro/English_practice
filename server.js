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

// GET /api/words
app.get('/api/words', (req, res) => {
  const all = readData();
  const { active } = req.query;
  if (active === 'true'){
    return res.json(all.filter(w => w.active));
  }
  res.json(all);
});

// POST /api/words  ⭐ 主要修改這裡
app.post('/api/words', (req, res) => {
  const { word, pos1, pos2, def, sample } = req.body || {};
  if (!word || !pos1 || !def) return res.status(400).json({ error: 'word, pos1 and def required' });

  const list = readData();
  const id = (list.reduce((m, x) => Math.max(m, x.id || 0), 0) || 0) + 1;

  const item = { 
    id, 
    word, 
    pos1: pos1 || '',
    pos2: pos2 || '',
    def, 
    sample: !!sample, 
    active: true 
  };

  list.push(item);
  if (!writeData(list)) return res.status(500).json({ error: 'failed to save' });

  res.status(201).json(item);
});

// PUT /api/words/:id（不需修改）
app.put('/api/words/:id', (req, res) => {
  const id = Number(req.params.id);
  const list = readData();
  const idx = list.findIndex(w => Number(w.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  // 直接合併即可，自動支援 pos2
  const updated = Object.assign({}, list[idx], req.body);
  list[idx] = updated;

  if (!writeData(list)) return res.status(500).json({ error: 'failed to save' });
  res.json(updated);
});

// DELETE /api/words/:id（不需修改）
app.delete('/api/words/:id', (req, res) => {
  const id = Number(req.params.id);
  let list = readData();
  const idx = list.findIndex(w => Number(w.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  const removed = list.splice(idx,1)[0];
  if (!writeData(list)) return res.status(500).json({ error: 'failed to save' });

  res.json(removed);
});

app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log('Server running on port', PORT);
});
