const PORT = process.env.PORT || 3001;
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const Notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));
// this will put the data into the json

app.get('/api/notes' , (req, res)=>{
    res.json(Notes);

});
// will send file into the html
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) =>{
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

// wild card
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});
// this function should create new tasks
function createNewTasks(body, taskArray){
    // const data = fs.readFileSync(path.join(__dirname, './db/db.json', 'utf8'))
    
    const newTask = body;
    // if(!Array.isArray(taskArray));
    // taskArray = [];
    
    // if (taskArray.length === 0)
    // taskArray.push(0);
    
    body.id = uuidv4();
    
    taskArray.push(body);
    console.log('data', body, taskArray)
    fs.writeFileSync(path.join(__dirname,'./db/db.json'), JSON.stringify(taskArray));
    return taskArray;
}

app.post('/api/notes', (req, res) =>{
    const newTask = createNewTasks(req.body, Notes);
    res.json(newTask);
});


app.delete('/api/notes/:id', (req, res) => {
  const noteIdToDelete = req.params.id;
  // Find the index of the note with the given id in the notes array
  const noteIndex = Notes.findIndex((note) => note.id === noteIdToDelete);
  if (noteIndex === -1) {
    // If the note with the given id is not found, return 404 Not Found
    return res.status(404).json({ error: 'Note not found' });
  }
  // Remove the note from the notes array
  Notes.splice(noteIndex, 1);
  // Update the db.json file with the updated notes array
  fs.writeFile(
    './db/db.json',
    JSON.stringify(Notes, null, 4),
    (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).json({ error: 'Failed to delete note' });
      }
      console.info('Successfully deleted Note!');
      return res.json(Notes);
    }
  );
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);