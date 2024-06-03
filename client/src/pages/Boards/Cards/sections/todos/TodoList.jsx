/* eslint-disable indent */
import {
  Box,
  Button,
  FormGroup,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch } from 'react-redux';
import { deleteTodoChild, deleteTodo } from '~/apis/cardApi';
import { toast } from 'react-toastify';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TodoChildList from './TodoChildList';

export default function CardTodoList({ todo, cardDetail, setCardDetail }) {
  const confirmDeleteTodo = useConfirm();
  const dispatch = useDispatch();
  const confirmDeleteTodoChild = useConfirm();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo?._id,
    data: { ...todo },
  });

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.4 : undefined,
  };

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

  const handleSaveEdit = (todoId, childId, newText) => {
    const updatedCard = {
      ...cardDetail,
      todos: cardDetail.todos.map((todo) =>
        todo._id === todoId
          ? {
              ...todo,
              childs: todo.childs.map((child) =>
                child._id === childId ? { ...child, text: newText } : child
              ),
            }
          : todo
      ),
    };
    setCardDetail(updatedCard);
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
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box {...listeners}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '18px !important' }}>
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
            ? todo.childs.map((child) => (
                <TodoChildList
                  key={child._id}
                  child={child}
                  todoId={todo._id}
                  handleToggleTodoChild={handleToggleTodoChild}
                  handleDeleteTodoChild={handleDeleteTodoChild}
                  handleSaveEdit={handleSaveEdit}
                />
              ))
            : ''}
        </FormGroup>
      </Box>
    </div>
  );
}
