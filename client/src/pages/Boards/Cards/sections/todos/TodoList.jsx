/* eslint-disable indent */
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  FormGroup,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch } from 'react-redux';
import {
  deleteTodoChild,
  deleteTodo,
  addTodoChild,
  childDone,
  updateTodoAPI,
} from '~/apis/cardApi';
import { toast } from 'react-toastify';
import TodoChildList from './TodoChildList';
import socket from '~/socket/socket';

export default function CardTodoList({ todo, cardDetail, setCardDetail }) {
  const confirmDeleteTodo = useConfirm();
  const dispatch = useDispatch();
  const confirmDeleteTodoChild = useConfirm();
  const [childText, setChildText] = useState('');
  const [showAddChildForm, setShowAddChildForm] = useState(null);
  const addChildRef = useRef(null);
  const [editTodoId, setEditTodoId] = useState(null); // state to store the todo being edited
  const [editTodoText, setEditTodoText] = useState(''); // state to store the new todo text

  useEffect(() => {
    socket.on('addTodo', (data) => {
      if (data) {
        setCardDetail({ ...cardDetail, todos: [...cardDetail.todos, data] });
      }
    });

    socket.on('updateTodo', (data) => {
      if (data) {
        setCardDetail(data);
      }
    });

    socket.on('deleteTodo', (todoId) => {
      if (todoId) {
        setCardDetail({
          ...cardDetail,
          todos: cardDetail.todos.filter((todo) => todo._id !== todoId),
        });
      }
    });

    socket.on('addTodoChild', (data) => {
      if (data) {
        setCardDetail(data);
      }
    });

    socket.on('updateTodoChild', (data) => {
      if (data) {
        setCardDetail(data);
      }
    });

    socket.on('deleteTodoChild', ({ childId, todoId }) => {
      if (childId) {
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
      }
    });

    return () => {
      socket.off('addTodo');
      socket.off('updateTodo');
      socket.off('deleteTodo');
      socket.off('addTodoChild');
      socket.off('updateTodoChild');
      socket.off('deleteTodoChild');
    };
  }, [cardDetail, setCardDetail]);

  const handleToggleTodoChild = async (todoId, childId, done) => {
    const result = await childDone({
      id: cardDetail._id,
      childId,
      data: { done: !done },
    });

    if (result.success) {
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
    }
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
    const updatedCard = await addTodoChild({
      id: cardDetail._id,
      data: { text: childText, todoId },
    });

    setCardDetail(updatedCard);
    setChildText('');
    addChildRef.current.focus();
  };

  const handleEditTodo = (todoId, newText) => {
    setEditTodoId(todoId);
    setEditTodoText(newText);
  };

  const handleSaveEditTodo = async (todoId) => {
    const updatedCard = await updateTodoAPI({
      id: cardDetail._id,
      todoId,
      data: { text: editTodoText },
    });

    setCardDetail(updatedCard);
    setEditTodoId(null);
  };

  const handleEditTodoKeyPress = (event, todoId) => {
    if (event.key === 'Enter') {
      handleSaveEditTodo(todoId);
    } else if (event.key === 'Escape') {
      setEditTodoId(null);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        {editTodoId === todo._id ? (
          <TextField
            size="small"
            value={editTodoText}
            onChange={(e) => setEditTodoText(e.target.value)}
            onKeyUp={(event) => handleEditTodoKeyPress(event, todo._id)}
            autoFocus
          />
        ) : (
          <Typography
            sx={{ fontWeight: 'bold', fontSize: '18px !important' }}
            onClick={() => handleEditTodo(todo._id, todo.text)}
          >
            {todo.text}
          </Typography>
        )}
        {editTodoId === todo._id ? (
          <Button
            size="small"
            variant="outlined"
            onClick={() => setEditTodoId(null)}
          >
            Cancel
          </Button>
        ) : (
          <Button
            onClick={() => handleDeleteTodo(todo._id)}
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Delete
          </Button>
        )}
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
                cardId={cardDetail._id}
                handleToggleTodoChild={handleToggleTodoChild}
                handleDeleteTodoChild={handleDeleteTodoChild}
                handleSaveEdit={handleSaveEdit}
              />
            ))
          : ''}
      </FormGroup>
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
            onKeyUp={(event) => handleAddChildKeyPress(event, todo._id)}
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
    </Box>
  );
}
