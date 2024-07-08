import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
  Alert,
  Snackbar,
  Fade,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [editDialog, setEditDialog] = useState({ open: false, todo: null, index: -1 });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const addTodo = () => {
    if (input.trim() !== '') {
      setTodos([...todos, { text: input.trim(), completed: false, priority: 'medium' }]);
      setInput('');
      showAlert('Todo added successfully!', 'success');
    }
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
    showAlert('Todo deleted successfully!', 'info');
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
    showAlert(newTodos[index].completed ? 'Todo completed!' : 'Todo marked as incomplete.', 'success');
  };

  const openEditDialog = (todo, index) => {
    setEditDialog({ open: true, todo: { ...todo }, index });
  };

  const closeEditDialog = () => {
    setEditDialog({ open: false, todo: null, index: -1 });
  };

  const updateTodo = () => {
    const newTodos = [...todos];
    newTodos[editDialog.index] = editDialog.todo;
    setTodos(newTodos);
    closeEditDialog();
    showAlert('Todo updated successfully!', 'success');
  };

  const showAlert = (message, severity) => {
    setAlert({ open: true, message, severity });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Enhanced Todo App
          </Typography>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                label="Add a new todo"
                variant="outlined"
                value={input}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={addTodo}
                sx={{ ml: 1 }}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  label="Filter"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <List>
              {filteredTodos.map((todo, index) => (
                <Fade in={true} key={index}>
                  <ListItem
                    divider
                    sx={{
                      backgroundColor: todo.completed ? 'rgba(0, 0, 0, 0.05)' : 'inherit',
                      borderLeft: `5px solid ${
                        todo.priority === 'high' ? '#f50057' :
                        todo.priority === 'medium' ? '#ff9800' : '#4caf50'
                      }`
                    }}
                  >
                    <ListItemText
                      primary={todo.text}
                      secondary={`Priority: ${todo.priority}`}
                      sx={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => openEditDialog(todo, index)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="complete"
                        onClick={() => toggleComplete(index)}
                      >
                        <CheckCircleIcon color={todo.completed ? 'success' : 'action'} />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteTodo(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </Fade>
              ))}
            </List>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Chip label={`Total: ${todos.length}`} color="primary" />
            <Chip label={`Active: ${todos.filter(t => !t.completed).length}`} color="secondary" />
            <Chip label={`Completed: ${todos.filter(t => t.completed).length}`} color="success" />
          </Box>
        </Box>
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
        <Dialog open={editDialog.open} onClose={closeEditDialog}>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Todo Text"
              type="text"
              fullWidth
              variant="outlined"
              value={editDialog.todo?.text || ''}
              onChange={(e) => setEditDialog({ ...editDialog, todo: { ...editDialog.todo, text: e.target.value } })}
            />
            <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editDialog.todo?.priority || 'medium'}
                onChange={(e) => setEditDialog({ ...editDialog, todo: { ...editDialog.todo, priority: e.target.value } })}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog}>Cancel</Button>
            <Button onClick={updateTodo} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default App;