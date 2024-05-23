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
import { NavLink, useParams } from 'react-router-dom';
import { getDetailWorkspace } from '~/redux/slices/workspaceSlice';
import { getRandomColor, getRandomGradient } from '~/utils/getRandomColor';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import NewBoardDialog from './NewBoardDialog';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

export default function WorkspaceDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { workspace } = useSelector((state) => state.workspaces);
  const [openModal, setOpenModal] = useState(false);
  const [workspaceIdActive, setWorkspaceIdActive] = useState(null);

  useEffect(() => {
    dispatch(getDetailWorkspace(id));
  }, [id, dispatch]);

  const handleOpenModal = (id) => {
    setOpenModal(true);
    setWorkspaceIdActive(id);
  };

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
          <Button startIcon={<PersonAddAlt1Icon />} variant="contained">
            Invite member
          </Button>
        </Box>

        {/* Description */}
        <Typography variant="caption">Description here</Typography>
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
                label="Age"
                size="small"
              >
                <MenuItem value="">
                  <em>Recent</em>
                </MenuItem>
                <MenuItem value={10}>A to Z</MenuItem>
                <MenuItem value={20}>Z to A</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="demo-select-small-label">Filter by</InputLabel>
              <Select
                size="small"
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Age"
              >
                <MenuItem value="">
                  <em>Recent</em>
                </MenuItem>
                <MenuItem value={10}>A to Z</MenuItem>
                <MenuItem value={20}>Z to A</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box>
            <TextField
              id="outlined-basic"
              label="Search ..."
              variant="outlined"
              size="small"
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
          {workspace?.boards?.map((board) => (
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
        >
          Delete this workspace
        </Button>
      </Box>
    </React.Fragment>
  );
}
