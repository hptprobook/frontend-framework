import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  deleteWorkspace,
  getAllWorkspace,
  getDetailWorkspace,
  inviteMember,
  updateWorkspace,
} from '~/redux/slices/workspaceSlice';
import { getRandomColor, getRandomGradient } from '~/utils/getRandomColor';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import NewBoardDialog from './NewBoardDialog';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useConfirm } from 'material-ui-confirm';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { unwrapResult } from '@reduxjs/toolkit';
import InviteToWorkspaceDialog from './InviteDialog';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 2 characters')
    .max(255, 'Title must be max 255 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(3, 'Description must be at least 2 characters')
    .max(512, 'Description must be max 512 characters'),
});

export default function WorkspaceDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { workspace } = useSelector((state) => state.workspaces);
  const { current } = useSelector((state) => state.users);
  const [openModal, setOpenModal] = useState(false);
  const [workspaceIdActive, setWorkspaceIdActive] = useState(null);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);
  const confirmDeleteWorkspace = useConfirm();
  const [isEditWorkspace, setEditWorkspace] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dispatch(getDetailWorkspace(id));
  }, [id, dispatch]);

  const handleOpenModal = (id) => {
    setOpenModal(true);
    setWorkspaceIdActive(id);
  };

  const handleDeleteWorkspace = () => {
    confirmDeleteWorkspace({
      title: 'Delete this workspace?',
      description:
        'Are you sure you want to delete this workspace? This action will delete all the boards, columns, cards!',
      confirmationButtonProps: { color: 'error', variant: 'outlined' },
      confirmationText: 'Confirm',
    })
      .then(() => {
        dispatch(deleteWorkspace(id));
        dispatch(getAllWorkspace());
        navigate('/w');
        toast.success('Deleted workspace successfully!');
      })
      .catch(() => {
        toast.error('Delete workspace failed!');
      });
  };

  const handleUpdateWorkspace = async (values) => {
    try {
      const resultAction = await dispatch(
        updateWorkspace({ id, data: values })
      );
      const result = unwrapResult(resultAction);
      if (result) {
        toast.success('Update workspace successfully!');
        dispatch(getDetailWorkspace(id));
        setEditWorkspace(false);
      } else {
        toast.error('Update workspace failed! Please try again!');
      }
    } catch (err) {
      toast.error('Update workspace failed! Please try again!');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleInvite = async () => {
    try {
      const resultAction = await dispatch(
        inviteMember({ id, data: { userId: current._id } })
      );
      const result = unwrapResult(resultAction);
      if (result) {
        toast.success('Member invited successfully!');
        setOpenInviteDialog(false);
      } else {
        toast.error('Invite member failed! Please try again!');
      }
    } catch (err) {
      toast.error('Invite member failed! Please try again!');
    }
  };

  const filteredBoards = workspace?.boards
    ?.filter((board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (order === 'A to Z') return a.title.localeCompare(b.title);
      if (order === 'Z to A') return b.title.localeCompare(a.title);
      return 0; // Default order
    });

  return (
    <React.Fragment>
      <Box
        sx={{
          mt: 2,
          ml: 8,
        }}
      >
        {/* Title */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {!isEditWorkspace ? (
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                alignItems: 'center',
              }}
            >
              <Avatar
                sx={{
                  width: '64px',
                  height: '64px',
                  bgcolor: getRandomColor(),
                }}
              >
                {workspace?.title[0]}
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: '600',
                  }}
                >
                  {workspace?.title}
                  <CreateOutlinedIcon
                    sx={{
                      fontSize: '20px',
                      ml: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => setEditWorkspace(true)}
                  />
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: '12px',
                    fontWeight: '300',
                    color: '#888',
                  }}
                >
                  Private
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <Formik
                initialValues={{
                  title: workspace.title,
                  description: workspace.description,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  handleUpdateWorkspace(values);
                  setEditWorkspace(false);
                  setSubmitting(false);
                }}
              >
                {({ errors, touched, handleSubmit, isSubmitting }) => (
                  <Form
                    onSubmit={handleSubmit}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <Field
                      as={TextField}
                      size="small"
                      name="title"
                      required
                      label="Title"
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
                    />
                    <Field
                      as={TextField}
                      name="description"
                      required
                      size="small"
                      label="Description"
                      error={touched.description && Boolean(errors.description)}
                      helperText={touched.description && errors.description}
                    />
                    <Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          mr: 1,
                        }}
                        disabled={isSubmitting}
                        type="submit"
                      >
                        Submit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        type="button"
                        onClick={() => setEditWorkspace(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          )}
          <Button
            startIcon={<PersonAddAlt1Icon />}
            variant="contained"
            onClick={() => setOpenInviteDialog(true)}
          >
            Invite member
          </Button>
        </Box>

        {/* Description */}
        {!isEditWorkspace && (
          <Typography variant="caption">{workspace?.description}</Typography>
        )}
      </Box>
      <Divider
        sx={{
          my: 2,
        }}
      />
      {/* List Board */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: '600',
          }}
        >
          Boards
        </Typography>

        {/* Filter, Order, Search */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            my: 3,
          }}
        >
          <Box>
            <FormControl sx={{ mr: 2, minWidth: 200 }} size="small">
              <InputLabel id="demo-select-small-label">Order by</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Order by"
                size="small"
                value={order}
                onChange={handleOrderChange}
              >
                <MenuItem value="">
                  <em>Recent</em>
                </MenuItem>
                <MenuItem value="A to Z">A to Z</MenuItem>
                <MenuItem value="Z to A">Z to A</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="demo-select-small-label">Filter by</InputLabel>
              <Select
                size="small"
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Filter by"
                value={filter}
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>Recent</em>
                </MenuItem>
                <MenuItem value="A to Z">A to Z</MenuItem>
                <MenuItem value="Z to A">Z to A</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <TextField
              id="outlined-basic"
              label="Search ..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Box>
        </Box>

        {/* List Item */}
        <NewBoardDialog
          open={openModal}
          setOpen={setOpenModal}
          workspaceId={workspaceIdActive}
          setWorkspaceIdActive={setWorkspaceIdActive}
        />
        <Grid container spacing={2}>
          {/* Board item */}
          {filteredBoards?.map((board) => (
            <React.Fragment key={board._id}>
              <Grid item xs={3}>
                <NavLink to={`/boards/${board._id}`}>
                  <Box
                    sx={{
                      background: getRandomGradient(),
                      height: '100px',
                      width: '100%',
                      borderRadius: '3px',
                      position: 'relative',
                      '&:hover': {
                        cursor: 'pointer',
                        opacity: '0,8',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        position: 'absolute',
                        top: '8px',
                        left: '12px',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '700',
                      }}
                    >
                      {board?.title}
                    </Typography>
                  </Box>
                </NavLink>
              </Grid>
            </React.Fragment>
          ))}

          <Grid item xs={3}>
            <Box
              sx={{
                background: '#091e4217',
                height: '100px',
                width: '100%',
                borderRadius: '3px',
                position: 'relative',
                '&:hover': {
                  cursor: 'pointer',
                  bgcolor: '#091e424d',
                },
              }}
              onClick={() => {
                handleOpenModal(workspace._id);
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#333',
                }}
              >
                New Board
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* Delete */}
      <Box>
        <Button
          sx={{
            mt: 10,
          }}
          variant="contained"
          color="error"
          startIcon={<DeleteForeverOutlinedIcon />}
          onClick={() => handleDeleteWorkspace()}
        >
          Delete this workspace
        </Button>
      </Box>
      <InviteToWorkspaceDialog
        open={openInviteDialog}
        onClose={() => setOpenInviteDialog(false)}
        result={inviteResult}
        onInvite={handleInvite}
      />
    </React.Fragment>
  );
}
