/* eslint-disable indent */
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { deleteTodoChild } from '~/apis/cardApi';
import { toast } from 'react-toastify';

export default function CardTodoList({ todo, cardDetail, setCardDetail }) {
  const confirmDeleteTodo = useConfirm();
  const dispatch = useDispatch();

  const handleToggleTodoChild = (todoId, childId, done) => {
    const updatedCard = {
      ...cardDetail,
      todos: cardDetail.todos.map((todo) =>
        todo._id === todoId
          ? {
              ...todo,
              childs: todo.childs.map((child) =>
                child._id === childId ? { ...child, done: !done } : child
              ),
            }
          : todo
      ),
    };
    setCardDetail(updatedCard);
    // dispatch(getDetails({ id: card._id }));
  };

  const handleDeleteTodoChild = (todoId, childId) => {
    confirmDeleteTodo({
      title: 'Delete this todo?',
      description: 'Are you sure you want to delete this todo?',
      confirmationButtonProps: { color: 'error', variant: 'outlined' },
      confirmationText: 'Confirm',
    }).then(() => {
      const updatedCard = {
        ...cardDetail,
        todos: cardDetail.todos.map((todo) =>
          todo._id === todoId
            ? {
                ...todo,
                childs: todo.childs.filter((child) => child._id !== childId),
              }
            : todo
        ),
      };
      setCardDetail(updatedCard);

      dispatch(deleteTodoChild({ id: cardDetail._id, todoId, childId }));
      toast.success('Deleted todo successfully!');
    });
  };

  const calculateCompletionPercentage = () => {
    const total = todo.childs.length;
    const completed = todo.childs.filter((child) => child.done).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <FormGroup>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <LinearProgress
            variant="determinate"
            value={calculateCompletionPercentage()}
          />
        </Box>
        <Typography variant="body1">
          {calculateCompletionPercentage()}%
        </Typography>
      </Box>
      {todo.childs.length
        ? todo.childs.map((child, id) => (
            <Box
              key={id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={child.done}
                      onChange={() =>
                        handleToggleTodoChild(todo._id, child._id, child.done)
                      }
                    />
                  }
                />
                <Typography
                  sx={{
                    textDecoration: child.done ? 'line-through' : 'none',
                  }}
                >
                  {child.text}
                </Typography>
              </Box>
              <IconButton
                aria-label="delete"
                onClick={() => {
                  handleDeleteTodoChild(todo._id, child._id);
                }}
              >
                <DeleteIcon sx={{ fontSize: '22px' }} />
              </IconButton>
            </Box>
          ))
        : ''}
    </FormGroup>
  );
}
