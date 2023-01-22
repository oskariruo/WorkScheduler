import React, {useState, useEffect} from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Checkbox, Select, SelectChangeEvent, FormControl, MenuItem } from '@mui/material';

import {ref, onValue, remove, query, push, update} from'firebase/database';
import { auth, database } from '../components/firebase-config';


interface TaskType {
  task: string
  description: string
  time: string
  completed: boolean
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function WorkScreen() {

    const [description, setDescription] = useState('')
    const [task, setTask] = useState('');
    const [time, setTime] = useState('');
    const [items, setItems] = useState<TaskType[]>([]);
    const [keys, setKeys] = useState<string[]>([]);
    const [shift, setShift] = useState("Morning")
    const [check, setCheck] = useState(false)

    const d = new Date();
    let day = d.getDay();


    const updateList = () => {
        const itemsRef = query(ref(database, day + '/' + shift));
        onValue(itemsRef, (snapshot) => {
          if (snapshot.exists()){
            const data = snapshot.val();
            setItems(Object.values(data));
            setKeys(Object.keys(data))
          } else {setItems([])
          }
        });
      }

      const handleChange = (event: SelectChangeEvent) => {
        setShift(event.target.value as string);
        updateList();
      };

      const checkItem = (index: any , isChecked: boolean) => {
        let reference = ref(database, day + '/' + shift + '/' + keys.splice(index)[0]);
          update(
            reference, {completed: isChecked}
          ).then(() => {
            updateList();
          })
      }

      useEffect(updateList, []);
  return (
    <React.Fragment>

      <Box>
        <FormControl fullWidth>
          <Select
            id="simple-select"
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
                <TableCell><Checkbox checked={row.completed} onChange={checkItem}></Checkbox></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </React.Fragment>
  );
}