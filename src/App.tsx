import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {Box, List} from '@mui/material';
import { mainListItems } from './components/ListItems';
import WorkScreen from './screens/WorkScreen';
import AccountScreen from './screens/AccountScreen';
import ADminScreen from './screens/AdminScreen';

function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <div className="App">
      <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
          <Box sx={{ display: 'flex' }}>
            <List component="nav">
              {mainListItems}
            </List>
          </Box>
        </ThemeProvider>

        <Routes>
          <Route path="/" element={<WorkScreen />}/>
          <Route path="/account" element={<AccountScreen />}/>
          <Route path="/admin" element={<ADminScreen />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
