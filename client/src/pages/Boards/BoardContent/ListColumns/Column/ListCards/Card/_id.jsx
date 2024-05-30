/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ListIcon from '@mui/icons-material/List';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formatDistanceToNow } from 'date-fns';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BadgeIcon from '@mui/icons-material/Badge';
import { convertHTMLToText } from '~/utils/formatters';
import TextField from '@mui/material/TextField';
import CommentIcon from '@mui/icons-material/Comment';
import { useDispatch, useSelector } from 'react-redux';
import {
  addComment,
  addTodo,
  addTodoChild,
  deleteCardDetails,
  deleteTodo,
  deleteTodoChild,
  getDetails,
  updateCardDetails,
} from '~/redux/slices/cardSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import MenuModal from '~/components/MenuModal';
import CardAction from './CardAction';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { unwrapResult } from '@reduxjs/toolkit';
import socket from '~/socket/socket';

export default function CardDetail({
  openModal,
  handleCloseModal,
  card,
  setCardTitle,
}) {
  const [desc, setDesc] = useState(card ? card.description : '');
  const [title, setTitle] = useState(card ? card.title : '');
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [isEditingDesc, setEditingDesc] = useState(false);
  const [initialDesc, setInitialDesc] = useState(card ? card.description : '');
  const [todoTitle, setTodoTitle] = useState('');
  const dispatch = useDispatch();
  const [cardDetail, setCardDetail] = useState(card);
  const { current } = useSelector((state) => state.users);
  const [showAddChildForm, setShowAddChildForm] = useState(null);
  const [childText, setChildText] = useState('');
  const [isComment, setComment] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  // useEffect(() => {
  //   if (card._id) {
  //     dispatch(getDetails({ id: card._id }));
  //   }
  // }, [card._id, dispatch]);

  // useEffect(() => {
  //   setCardDetail(card);
  // }, [card]);

  useEffect(() => {
    socket.on('comment', (newComment) => {
      if (newComment._id === card._id) {
        setCardDetail((prevCardDetail) => ({
          ...prevCardDetail,
          comments: newComment.comments,
        }));
      }
    });

    return () => {
      socket.off('comment');
    };
  }, [card._id]);

  const handleSaveDesc = () => {
    setEditingDesc(false);
    const updatedCard = { ...cardDetail, description: desc };
    setCardDetail(updatedCard);
    dispatch(updateCardDetails({ id: card._id, data: { description: desc } }));
    setInitialDesc(desc);
  };

  const handleCancelEditDesc = () => {
    setEditingDesc(false);
    setDesc(initialDesc);
  };

  const handleSaveTitle = (e) => {
    if (e.key === 'Enter') {
      setEditingTitle(false);
      const updatedCard = { ...cardDetail, title: e.target.value };
      setCardDetail(updatedCard);
      dispatch(
        updateCardDetails({ id: card._id, data: { title: e.target.value } })
      );
      setCardTitle(e.target.value);
    }
  };

  const handleCancelEditTitle = () => {
    setEditingTitle(false);
  };

  const confirmDeleteCard = useConfirm();

  const handleDeleteCard = () => {
    confirmDeleteCard({
      title: 'Delete Card?',
      description:
        'Are you sure you want to delete this card? This action will delete the currently selected card',
      confirmationButtonProps: { color: 'error', variant: 'outlined' },
      confirmationText: 'Confirm',
    }).then(() => {
      dispatch(deleteCardDetails({ id: card._id }));
      toast.success('Deleted card successfully!');
      handleCloseModal();
    });
  };

  const [addMemberMenu, setAddMemberMenu] = useState(null);
  const handleAddMemberClick = (event) => {
    setAddMemberMenu(event.currentTarget);
  };

  const [addTodoMenu, setAddTodoMenu] = useState(null);
  const handleAddTodoClick = (event) => {
    setAddTodoMenu(event.currentTarget);
  };

  const handleAddTodo = async () => {
    setAddTodoMenu(null);
    const newTodo = { text: todoTitle, childs: [] };
    const updatedCard = {
      ...cardDetail,
      todos: [...cardDetail.todos, newTodo],
    };
    setCardDetail(updatedCard);

    const resultAction = await dispatch(
      addTodo({ id: card._id, data: { text: todoTitle } })
    );
    const result = unwrapResult(resultAction);
    if (result) {
      setTodoTitle('');
      handleAddChildFormOpen(result.todos[result.todos.length - 1]._id);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleAddChildFormOpen = (todoId) => {
    setShowAddChildForm(todoId);
  };

  const handleAddChildFormClose = () => {
    setShowAddChildForm(null);
  };

  const addChildRef = useRef(null);
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

  const handleAddChildKeyPress = (event, todoId) => {
    if (event.key === 'Enter') {
      handleAddChild(todoId);
    } else if (event.key === 'Escape') {
      handleAddChildFormClose();
    }
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
    dispatch(getDetails({ id: card._id }));
  };

  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const confirmDeleteTodo = useConfirm();
  const confirmDeleteTodoChild = useConfirm();
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

  const handleAddComment = () => {
    const newComment = {
      content: commentContent,
      userId: current._id,
      userName: current.displayName,
      createdAt: new Date().toISOString(),
    };
    const updatedCard = {
      ...cardDetail,
      comments: [...cardDetail.comments, newComment],
    };
    setCardDetail(updatedCard);

    // eslint-disable-next-line no-unused-vars
    const { createdAt, ...commentWithoutCreatedAt } = newComment;

    dispatch(addComment({ id: card._id, data: commentWithoutCreatedAt }));
    setComment(false);
    setCommentContent('');
  };

  return (
    <React.Fragment key={card._id}>
      <Dialog
        sx={{
          '& .MuiPaper-root': {
            height: 'auto',
            maxWidth: '800px',
            width: '800px',
            borderRadius: '10px',
          },
        }}
        data-no-dnd="true"
        open={openModal}
        onClose={handleCloseModal}
      >
        <Grid container spacing={2} sx={{ px: 3, pt: 3 }}>
          <Grid item xs={1}>
            <CreditCardIcon />
          </Grid>
          <Grid item xs={8}>
            {isEditingTitle ? (
              <Box>
                <TextField
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleCancelEditTitle}
                  size="small"
                  onKeyUp={handleSaveTitle}
                  sx={{
                    m: 0,
                    p: 0,
                    ' input': {
                      height: '10px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    },
                  }}
                />
              </Box>
            ) : (
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: '18px !important',
                }}
                onClick={() => setEditingTitle(true)}
              >
                {title}
              </Typography>
            )}
            <Typography gutterBottom>
              owned by <a href="#">{card?.columnId}</a>
            </Typography>
          </Grid>
          <Grid
            item
            xs={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <Button onClick={handleDeleteCard}>Delete</Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ px: 3, pt: 3 }}>
          <Grid item xs={1}>
            <ListIcon />
          </Grid>
          <Grid item xs={7.5}>
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '18px !important',
              }}
              gutterBottom
            >
              Description
            </Typography>
            {isEditingDesc ? (
              <>
                <ReactQuill
                  value={desc}
                  onChange={setDesc}
                  style={{ marginBottom: '12px' }}
                />
                <Button
                  onClick={handleSaveDesc}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancelEditDesc}
                  size="small"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Box onClick={() => setEditingDesc(true)}>
                {desc ? (
                  convertHTMLToText(desc)
                ) : (
                  <Typography
                    sx={{
                      fontStyle: 'italic',
                      color: 'gray',
                      cursor: 'pointer',
                    }}
                  >
                    Click to add Description
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
          <Grid item xs={3.5}>
            <CardAction
              icon={<PersonIcon />}
              text={'Members'}
              handleClick={handleAddMemberClick}
            />
            <MenuModal
              anchorEl={addMemberMenu}
              setAnchorEl={setAddMemberMenu}
              id={'add-member'}
              menuChildren={
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
              }
            />

            <CardAction
              icon={<TaskAltIcon />}
              text={'Todos'}
              handleClick={handleAddTodoClick}
            />
            <MenuModal
              anchorEl={addTodoMenu}
              setAnchorEl={setAddTodoMenu}
              id={'add-todo'}
              menuChildren={
                <Box sx={{ px: 3, py: 2, width: '240px' }}>
                  <Typography textAlign={'center'} gutterBottom>
                    Add todo list
                  </Typography>
                  <TextField
                    size="small"
                    label={'Enter todo title'}
                    autoFocus
                    required
                    sx={{ my: 2 }}
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                    onKeyUp={handleKeyPress}
                    fullWidth
                  />
                  <Button variant="outlined" fullWidth onClick={handleAddTodo}>
                    Add
                  </Button>
                </Box>
              }
            />

            <CardAction icon={<AttachFileIcon />} text={'Attachments'} />
            <MenuModal
              anchorEl={''}
              setAnchorEl={''}
              id={'ad'}
              menuChildren={
                <MenuItem>
                  <Avatar /> Todo
                </MenuItem>
              }
            />

            <CardAction icon={<BadgeIcon />} text={'Cover Image'} />
            <MenuModal
              anchorEl={''}
              setAnchorEl={''}
              id={'add'}
              menuChildren={
                <MenuItem>
                  <Avatar /> Todo
                </MenuItem>
              }
            />
          </Grid>
        </Grid>

        {cardDetail?.todos && cardDetail?.todos.length
          ? cardDetail?.todos.map((todo) => (
              <Grid key={todo._id} container spacing={2} sx={{ px: 3, pt: 3 }}>
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
                  <FormGroup>
                    {todo.childs.length
                      ? todo.childs.map((child) => (
                          <Box
                            key={child._id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  size="small"
                                  checked={child.done}
                                  onChange={() =>
                                    handleToggleTodoChild(
                                      todo._id,
                                      child._id,
                                      child.done
                                    )
                                  }
                                />
                              }
                              label={child.text}
                            />
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
        <Grid container spacing={2} sx={{ px: 3, pt: 3 }}>
          <Grid item xs={1}>
            <CommentIcon />
          </Grid>
          <Grid item xs={8}>
            <Typography
              sx={{ fontWeight: 'bold', fontSize: '18px !important' }}
            >
              Comments
            </Typography>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
        <Grid container spacing={2} sx={{ px: 3, pt: 3 }}>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            {cardDetail?.comments
              ? cardDetail?.comments.map((comment) => (
                  <React.Fragment key={comment?._id}>
                    <Box sx={{ my: 1 }}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: '30px',
                            height: '30px',
                            fontSize: '16px',
                            bgcolor: 'red',
                          }}
                        >
                          H
                        </Avatar>
                        <Typography variant="body2">
                          {comment?.userName}
                        </Typography>
                        <Typography variant="caption">
                          {formatTimestamp(comment?.createdAt)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          mt: 1,
                          px: 3,
                          borderRadius: '8px',
                          border: '1px solid #e4e6ea',
                          bgcolor: '#e4e6ea',
                        }}
                      >
                        <Box
                          dangerouslySetInnerHTML={{ __html: comment?.content }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '12px !important',
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          React
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px !important',
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          Reply
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px !important',
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px !important',
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </Typography>
                      </Box>
                    </Box>
                  </React.Fragment>
                ))
              : ''}
            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: '30px',
                    height: '30px',
                    fontSize: '16px',
                    bgcolor: 'red',
                  }}
                >
                  You
                </Avatar>
                {!isComment ? (
                  <Box
                    sx={{
                      py: 1,
                      px: 3,
                      borderRadius: '8px',
                      border: '1px solid #e4e6ea',
                      bgcolor: '#e4e6ea',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    onClick={() => setComment(true)}
                  >
                    <Typography>Viết bình luận ...</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <ReactQuill
                      value={commentContent}
                      onChange={setCommentContent}
                      style={{ marginBottom: '12px' }}
                    />
                    <Box>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={handleAddComment}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setComment(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            sx={{
              mr: 2,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
