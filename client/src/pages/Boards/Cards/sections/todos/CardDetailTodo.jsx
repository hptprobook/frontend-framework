/* eslint-disable indent */

/* Config */
import { toast } from 'react-toastify';
import { useRef, useState } from 'react';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch } from 'react-redux';

/* MUI components */
import {
  Box,
  Button,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/* API endpoint */
import { addTodoChild, deleteTodo } from '~/redux/slices/cardSlice';
import CardTodoList from './TodoList';

export default function CardDetailTodo({ cardDetail, setCardDetail }) {
  const dispatch = useDispatch();
  const addChildRef = useRef(null);

  const confirmDeleteTodoChild = useConfirm();

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

  const handleAddChild = (todoId) => {
    const updatedCard = {
      ...cardDetail,
      todos: cardDetail.todos.map((todo) =>
        todo._id === todoId
          ? {
              ...todo,
              childs: [...todo.childs, { text: childText, done: false }],
            }
          : todo
      ),
    };
    setCardDetail(updatedCard);

    dispatch(
      addTodoChild({ id: cardDetail._id, data: { text: childText, todoId } })
    );
    setChildText('');
    addChildRef.current.focus();
  };

  const handleDeleteTodo = (todoId) => {
    confirmDeleteTodoChild({
      title: 'Delete Todo?',
      description: 'Are you sure you want to delete this todo?',
      confirmationButtonProps: { color: 'error', variant: 'outlined' },
      confirmationText: 'Confirm',
    }).then(() => {
      const updatedCard = {
        ...cardDetail,
        todos: cardDetail.todos.filter((todo) => todo._id !== todoId),
      };
      setCardDetail(updatedCard);

      dispatch(deleteTodo({ id: cardDetail._id, todoId }));
      toast.success('Deleted todo successfully!');
    });
  };

  return (
    <Box>
      {cardDetail?.todos && cardDetail?.todos.length
        ? cardDetail?.todos.map((todo, id) => (
            <Grid key={id} container spacing={2} sx={{ px: 3, pt: 3 }}>
              <Grid item xs={1}>
                <CheckCircleOutlineIcon />
              </Grid>
              <Grid item xs={7}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 'bold', fontSize: '18px !important' }}
                  >
                    {todo.text}
                  </Typography>
                  <Button
                    onClick={() => handleDeleteTodo(todo._id)}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  >
                    Delete
                  </Button>
                </Box>

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
