import React, { useState } from "react";
import styles from "./TaskItem.module.css";
import { ListItem, TextField, Grid, Button } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material";
import { auth, database } from '../components/firebase-config';

interface PROPS {
  id: string;
  title: string;
}

const TaskItem: React.FC<PROPS> = (props) => {
  const [title, setTitle] = useState(props.title);


  return (
    <ListItem>
      
    </ListItem>
  );
};

export default TaskItem;