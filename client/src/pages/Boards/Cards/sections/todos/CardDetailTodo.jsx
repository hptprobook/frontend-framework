/* eslint-disable indent */

/* Config */
import { useRef, useState } from 'react';

/* MUI components */
import { Box, Button, Grid, TextField } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/* API endpoint */

import CardTodoList from './TodoList';
import { addTodoChild } from '~/apis/cardApi';

export default function CardDetailTodo({ cardDetail, setCardDetail }) {
  const addChildRef = useRef(null);

  const [childText, setChildText] = useState('');
  const [showAddChildForm, setShowAddChildForm] = useState(null);

  const handleAddChildKeyPress = (event, todoId) => {
    if (event.key === 'Enter') {
      handleAddChild(todoId);
    } else if (event.key === 'Escape') {
      handleAddChildFormClose();
    }
  };

  const handleAddChildFormOpen = (todoId) => {
    setShowAddChildForm(todoId);
  };

  const handleAddChildFormClose = () => {
    setShowAddChildForm(null);
  };

  const handleAddChild = async (todoId) => {
    const childAdded = await addTodoChild({
      id: cardDetail._id,
      data: { text: childText, todoId },
    });

    const updatedCard = {
      ...cardDetail,
      todos: cardDetail.todos.map((todo) =>
        todo._id === todoId
          ? {
              ...todo,
              childs: [...todo.childs, childAdded],
            }
          : todo
      ),
    };

    setCardDetail(updatedCard);

    setChildText('');
    addChildRef.current.focus();
  };

  return (
    <Box>
      {cardDetail?.todos && cardDetail?.todos.length
        ? cardDetail?.todos.map((todo, id) => (
            <Grid key={id} container spacing={2} sx={{ px: 3, pt: 3 }}>
              <Grid item xs={1}>
                <CheckCircleOutlineIcon />
              </Grid>
              <Grid
                item
                xs={7}
                sx={{
                  mb: 4,
                }}
              >
                <CardTodoList
                  todo={todo}
                  cardDetail={cardDetail}
                  setCardDetail={setCardDetail}
                />

                {showAddChildForm === todo._id ? (
                  <Box>
                    <TextField
                      fullWidth
                      size="small"
                      label="Enter child todo text"
                      value={childText}
                      onChange={(e) => setChildText(e.target.value)}
                      autoFocus
                      ref={addChildRef}
                      onKeyUp={(event) =>
                        handleAddChildKeyPress(event, todo._id)
                      }
                      sx={{ mb: 1 }}
                    />
                    <Box display="flex" justifyContent="space-between">
                      <Button
                        onClick={() => handleAddChild(todo._id)}
                        variant="contained"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Add
                      </Button>
                      <Button
                        onClick={handleAddChildFormClose}
                        variant="outlined"
                        size="small"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => handleAddChildFormOpen(todo._id)}
                  >
                    Add Child
                  </Button>
                )}
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          ))
        : ''}
    </Box>
  );
}
