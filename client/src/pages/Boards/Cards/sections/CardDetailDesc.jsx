/* Config */
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import { convertHTMLToText } from '~/utils/formatters';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

/* MUI components */
import {
  Avatar,
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BadgeIcon from '@mui/icons-material/Badge';
import ListIcon from '@mui/icons-material/List';

/* Section */
import CardAction from './CardAction';
import MenuModal from '~/components/MenuModal';

/* API endpoint */
import { addTodo, updateCardDetails } from '~/redux/slices/cardSlice';

export default function CardDetailDesc({
  card,
  cardDetail,
  setCardDetail,
  handleAddChildFormOpen,
}) {
  const dispatch = useDispatch();
  const [addMemberMenu, setAddMemberMenu] = useState(null);
  const [addTodoMenu, setAddTodoMenu] = useState(null);
  const [desc, setDesc] = useState(card ? card.description : '');
  const [isEditingDesc, setEditingDesc] = useState(false);
  const [initialDesc, setInitialDesc] = useState(card ? card.description : '');
  const [todoTitle, setTodoTitle] = useState('');

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

  const handleAddMemberClick = (event) => {
    setAddMemberMenu(event.currentTarget);
  };

  const handleAddTodoClick = (event) => {
    setAddTodoMenu(event.currentTarget);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
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

  return (
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
  );
}
