import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, NavLink } from 'react-router-dom';
import { getRandomColor, getRandomGradient } from '~/utils/getRandomColor';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { getAllWorkspace } from '~/redux/slices/workspaceSlice';
import NewBoardDialog from './NewBoardDialog';

export default function WorkspacePage() {
  const dispatch = useDispatch();
  const { workspaces } = useSelector((state) => state.workspaces);
  const [openModal, setOpenModal] = useState(false);
  const [workspaceIdActive, setWorkspaceIdActive] = useState(null);

  useEffect(() => {
    dispatch(getAllWorkspace());
  }, [dispatch]);

  const handleOpenModal = (id) => {
    setOpenModal(true);
    setWorkspaceIdActive(id);
  };

  return (
    <Box
      sx={{
        mt: 1,
      }}
    >
      <NewBoardDialog
        open={openModal}
        setOpen={setOpenModal}
        workspaceId={workspaceIdActive}
        setWorkspaceIdActive={setWorkspaceIdActive}
      />
      <Box>
        <Box
          sx={{
            gap: 2,
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: '15px', fontWeight: '700', mb: 3 }}>
            YOUR WORKSPACES
          </Typography>

          {workspaces?.created?.map((workspace) => (
            <React.Fragment key={workspace._id}>
              <Box
                sx={{
                  mb: 5,
                }}
              >
                {/* Workspace item navbar */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar
                      sx={{ bgcolor: getRandomColor(), width: 32, height: 32 }}
                    >
                      {workspace?.title[0].toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                      {workspace?.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    <Link to={`/w/${workspace?._id}`}>
                      <Button
                        startIcon={<SpaceDashboardIcon />}
                        variant="contained"
                        size="small"
                      >
                        Board
                      </Button>
                    </Link>
                    <Button
                      startIcon={<PersonOutlineIcon />}
                      variant="contained"
                      size="small"
                    >
                      Member ( {workspace?.members.length} )
                    </Button>
                    <Button
                      startIcon={<SettingsIcon />}
                      variant="contained"
                      size="small"
                    >
                      Setting
                    </Button>
                  </Box>
                </Box>

                {/* Workspace item content */}
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
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
              </Box>
            </React.Fragment>
          ))}
          {/* Workspaces item */}
        </Box>
        <Box
          sx={{
            gap: 2,
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: '15px', fontWeight: '700', mb: 3 }}>
            CLIENT WORKSPACES
          </Typography>

          {/* Workspaces item */}
          {workspaces?.clienter?.map((workspace) => (
            <React.Fragment key={workspace._id}>
              <Box
                sx={{
                  mb: 5,
                }}
              >
                {/* Workspace item navbar */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar
                      sx={{ bgcolor: getRandomColor(), width: 32, height: 32 }}
                    >
                      {workspace?.title[0].toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                      {workspace?.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                    }}
                  >
                    <Link to={`/w/${workspace?._id}`}>
                      <Button
                        startIcon={<SpaceDashboardIcon />}
                        variant="contained"
                        size="small"
                      >
                        Board
                      </Button>
                    </Link>
                    <Button
                      startIcon={<PersonOutlineIcon />}
                      variant="contained"
                      size="small"
                    >
                      Member ( {workspace?.members.length} )
                    </Button>
                    <Button
                      startIcon={<SettingsIcon />}
                      variant="contained"
                      size="small"
                    >
                      Setting
                    </Button>
                  </Box>
                </Box>

                {/* Workspace item content */}
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
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
              </Box>
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
