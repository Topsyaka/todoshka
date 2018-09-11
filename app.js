const express = require('express');
const bodyParser = require('body-parser');
const sqlite = require('sqlite3').verbose();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = new sqlite.Database(':memory:');

db.all(`CREATE TABLE Todos (id INTEGER PRIMARY KEY, name TEXT, done BOOLEAN)`)

app.get('/todos',  async (req, res) => {
  const sql = `SELECT * FROM Todos`;
  db.all(sql, [], (err, rows) => res.json(rows));
});

app.post('/todos', async (req, res) => {
  const name = req.body.name;
  const sql = `INSERT INTO Todos (name, done) VALUES (?, FALSE)`
  db.all(sql, [name], (err, rows) => {
    if(err) return res.json(result);
    const sql = `SELECT * FROM Todos`;
    db.all(sql, [], (err, rows) => res.json(rows));
  });
});

app.put('/todos', (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  db.all(`SELECT * FROM Todos WHERE id=?`, [id], (err, rows) => {
    const newStatus = !rows[0].done;
    const sql = `UPDATE Todos SET done=? WHERE id=?`;
    db.all(sql, [newStatus, id], (err, rows) => {
      const sql = `SELECT * FROM Todos`;
      db.all(sql, [], (err, rows) => res.json(rows));
    });
  })
});

app.delete('/todos', (req, res) => {
  const query = req.query;
  const id = req.query.id;
  const sql = `DELETE FROM Todos WHERE id=${id}`;
  if (id) {
    db.all(sql, [], (err, rows) => {
      res.json({message: 'Item is deleted'});
      return;
    })
  }
  res.json({error: 'Sthms went wrong'});
})

app.listen(4500, () => {
  console.log('server running');
})