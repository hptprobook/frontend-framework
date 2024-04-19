/* eslint-disable indent */
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ListIcon from '@mui/icons-material/List';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import BadgeIcon from '@mui/icons-material/Badge';
import { convertHTMLToText } from '~/utils/formatters';
import TextField from '@mui/material/TextField';
import CommentIcon from '@mui/icons-material/Comment';
import { useDispatch /* useSelector */, useSelector } from 'react-redux';
import {
  addTodo,
  addTodoChild,
  deleteCardDetails,
  getDetails,
  updateCardDetails,
} from '~/redux/slices/cardSlice';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import MenuModal from '~/components/MenuModal';
import CardAction from './CardAction';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
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
  const { cards } = useSelector((state) => state.cards);
  const [showAddChildForm, setShowAddChildForm] = useState(null);
  const [childText, setChildText] = useState('');
  const [checkedTodos, setCheckedTodos] = useState({});

  useEffect(() => {
    dispatch(getDetails({ id: card._id }));
  }, [dispatch, card]);

  useEffect(() => {
    setCardDetail(cards);
  }, [cards]);
  console.log('🚀 ~ cards:', cards);
  const handleSaveDesc = () => {
    setEditingDesc(false);
    dispatch(
      updateCardDetails({
        id: card._id,
        data: {
          description: desc,
        },
      })
    );
    setInitialDesc(desc);
  };

  const handleCancelEditDesc = () => {
    setEditingDesc(false);
    setDesc(initialDesc);
  };

  const handleSaveTitle = (e) => {
    if (e.key === 'Enter') {
      setEditingTitle(false);
      setTitle(e.target.value);
      dispatch(
        updateCardDetails({
          id: card._id,
          data: {
            title,
          },
        })
      );
      setCardTitle(title);
    }
  };

  const handleCancelEditTitle = () => {
    setDesc(initialDesc);
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

  const handleAddTodo = () => {
    dispatch(addTodo({ id: card._id, data: { text: todoTitle } }));
    dispatch(getDetails({ id: card._id }));
  };

  const handleAddChildFormOpen = (todoId) => {
    setShowAddChildForm(todoId);
  };

  const handleAddChildFormClose = () => {
    setShowAddChildForm(null);
  };

  const handleAddChild = (todoId) => {
    dispatch(
      addTodoChild({ id: cardDetail._id, data: { text: childText, todoId } })
    );
    dispatch(getDetails({ id: card._id }));
    handleAddChildFormClose();
    setChildText('');
  };

  const handleToggleTodoChild = (todoId, childId, currentDone) => {
    const newDoneStatus = !currentDone;

    // dispatch(updateTodoChild({
    //   id: cardDetail._id,
    //   todoId,
    //   childId,
    //   done: newDoneStatus
    // }));

    dispatch(getDetails({ id: card._id }));
  };

  return (
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
      <Grid
        container
        spacing={2}
        sx={{
          px: 3,
          pt: 3,
        }}
      >
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
      <Grid
        container
        spacing={2}
        sx={{
          px: 3,
          pt: 3,
        }}
      >
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
                style={{
                  marginBottom: '12px',
                }}
              />
              <Button
                onClick={handleSaveDesc}
                size="small"
                variant="outlined"
                sx={{
                  mr: 1,
                }}
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
            <Typography variant="body1" onClick={() => setEditingDesc(true)}>
              {desc ? (
                convertHTMLToText(desc)
              ) : (
                <Typography
                  sx={{ fontStyle: 'italic', color: 'gray', cursor: 'pointer' }}
                >
                  Click to add Description
                </Typography>
              )}
            </Typography>
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
              <>
                <MenuItem>
                  <Avatar /> Profile
                </MenuItem>
              </>
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
              <>
                <Typography textAlign={'center'} gutterBottom>
                  Add todo list
                </Typography>
                <MenuItem>
                  <TextField
                    size="small"
                    label={'Enter todo title'}
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                  />
                </MenuItem>
                <MenuItem onClick={handleAddTodo}>
                  <Button variant="outlined" fullWidth>
                    Add
                  </Button>
                </MenuItem>
              </>
            }
          />

          <CardAction icon={<AttachFileIcon />} text={'Attachments'} />
          <MenuModal
            anchorEl={''}
            setAnchorEl={''}
            id={'ad'}
            menuChildren={
              <>
                <MenuItem>
                  <Avatar /> Todo
                </MenuItem>
              </>
            }
          />

          <CardAction icon={<BadgeIcon />} text={'Cover Image'} />
          <MenuModal
            anchorEl={''}
            setAnchorEl={''}
            id={'add'}
            menuChildren={
              <>
                <MenuItem>
                  <Avatar /> Todo
                </MenuItem>
              </>
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
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '18px !important',
                  }}
                >
                  {todo.text}
                </Typography>
                <FormGroup>
                  {todo.childs.length
                    ? todo.childs.map((child) => (
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
                          key={child._id}
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
      <Grid
        container
        spacing={2}
        sx={{
          px: 3,
          pt: 3,
        }}
      >
        <Grid item xs={1}>
          <CommentIcon />
        </Grid>
        <Grid item xs={8}>
          <Typography
            sx={{
              fontWeight: 'bold',
              fontSize: '18px !important',
            }}
          >
            Comments
          </Typography>
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
  );
}
