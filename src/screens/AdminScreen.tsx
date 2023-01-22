import React, {useState, useEffect} from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Grid, TextField, Button, FormControlLabel, Checkbox, Select, SelectChangeEvent, FormControl, MenuItem } from '@mui/material';

import {ref, onValue, remove, orderByChild, equalTo, query, push} from'firebase/database';
import { auth, database } from '../components/firebase-config';


interface TaskType {
  task: string
  description: string
  time: string
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function AdminScreen() {

    const [description, setDescription] = useState('')
    const [task, setTask] = useState('');
    const [time, setTime] = useState('');
    const [items, setItems] = useState<TaskType[]>([]);
    const [keys, setKeys] = useState<string[]>([]);
    const [shift, setShift] = useState("Morning")
    const [date, setDate] = useState<string>()

    const handleDateChange = (event: SelectChangeEvent) => {
        setDate(event.target.value as string);
      };

    const updateList = () => {
        const itemsRef = query(ref(database, date + '/' + shift));
        onValue(itemsRef, (snapshot) => {
          if (snapshot.exists()){
            const data = snapshot.val();
            setItems(Object.values(data));
            setKeys(Object.keys(data))
          } else {setItems([])
          }
        });
      }

      const saveTask = () => {
        push(
          ref(database, date + '/' + shift),
          { 'task': task, 'description': description, 'time': time})
          .then(() => {
            updateList();
          })
      }

      const deleteTask = (index: any) => {
        let reference = ref(database, date + '/' + shift + '/' + keys.splice(index)[0]);
        remove(
            reference
          ).then(() => {
            updateList();
          })
        }

      const handleChange = (event: SelectChangeEvent) => {
        setShift(event.target.value as string);
      };

      useEffect(updateList, []);
  return (
    <React.Fragment>

      <Box>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                  name="task"
                  required
                  fullWidth
                  id="task"
                  label="Task"
                  onChange={event => setTask(event.target.value as string)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="description"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  onChange={event => setDescription(event.target.value as string)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="time"
                  label="Time"
                  name="time"
                  onChange={event => setTime(event.target.value as string)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => saveTask()}
            >
              Save
            </Button>
            <Button onClick={() => console.log(time)}>
              print
            </Button>
            <FormControl fullWidth>
             <Select
    id="demo-simple-select"
    value={date}
    label="Date"
    onChange={handleDateChange}
  >
    <MenuItem value={0}>Ma</MenuItem>
    <MenuItem value={1}>Ti</MenuItem>
    <MenuItem value={2}>Ke</MenuItem>
    <MenuItem value={3}>To</MenuItem>
    <MenuItem value={4}>Pe</MenuItem>
    <MenuItem value={5}>La</MenuItem>
    <MenuItem value={6}>Su</MenuItem>
  </Select>
</FormControl>
            <FormControl fullWidth>
             <Select
    id="demo-simple-select"
    value={shift}
    label="Shift"
    onChange={() => handleChange}
  >
    <MenuItem value={"Morning"}>Aamu</MenuItem>
    <MenuItem value={"Day"}>Päivä</MenuItem>
    <MenuItem value={"Evening"}>Ilta</MenuItem>
  </Select>
</FormControl>
          </Box>
          <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Done</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((row) => (
            <TableRow key={row.task}>
              <TableCell>{row.task}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell><Checkbox></Checkbox></TableCell>
              <TableCell><Button onClick={deleteTask}>Delete</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}