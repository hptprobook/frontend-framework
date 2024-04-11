import { Box, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getAllBoards, getOtherBoards } from '~/redux/slices/boardSlice';
import CircularLoading from '~/components/Loading/CircularLoading';
import NewBoardDialog from './NewBoardDialog';

export default function Board() {
  const dispatch = useDispatch();
  const { boards, otherBoards, isLoading } = useSelector(
    (state) => state.boards
  );
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getAllBoards());
    dispatch(getOtherBoards());
  }, [dispatch]);

  if (isLoading) {
    return <CircularLoading />;
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <Box
      sx={{
        height: (theme) => theme.height.boardHeight,
        width: '100%',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
        }}
        gutterBottom
      >
        Your board list
      </Typography>
      <Grid
        sx={{
          display: 'flex',
          mt: 0.5,
        }}
        container
        spacing={2}
      >
        {boards?.map((board) => (
          <Grid key={board._id} item lg={2} sm={3} md={6}>
            <Link to={`/boards/${board._id}`}>
              <Card
                sx={{
                  width: '100%',
                  height: '180px',
                  m: 0,
                  '&:hover': {
                    opacity: '0.8',
                  },
                }}
              >
                <CardMedia
                  sx={{
                    height: '100%',
                    '& div': {
                      backgroundSize: 'cover',
                    },
                  }}
                  image="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                  title="green iguana"
                >
                  <Typography
                    sx={{
                      color: '#fff',
                      px: 2,
                      py: 1,
                    }}
                    variant="h6"
                  >
                    {board?.title}
                  </Typography>
                </CardMedia>
              </Card>
            </Link>
          </Grid>
        ))}

        <Grid item lg={2} sm={3} md={6}>
          <Card
            sx={{
              width: '100%',
              height: '180px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{
                height: '100%',
              }}
              startIcon={<LibraryAddIcon />}
              onClick={handleOpenModal}
            >
              New Board
            </Button>
          </Card>
        </Grid>
      </Grid>

      {otherBoards.length ? (
        <Box
          sx={{
            mt: 5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
            }}
            gutterBottom
          >
            Other board list
          </Typography>
          <Grid
            sx={{
              display: 'flex',
              mt: 0.5,
            }}
            container
            spacing={2}
          >
            {otherBoards.map((board) => (
              <Grid key={board._id} item lg={2} sm={3} md={6}>
                <Link to={`/boards/${board._id}`}>
                  <Card
                    sx={{
                      width: '100%',
                      height: '180px',
                      m: 0,
                      '&:hover': {
                        opacity: '0.8',
                      },
                    }}
                  >
                    <CardMedia
                      sx={{
                        height: '100%',
                        '& div': {
                          backgroundSize: 'cover',
                        },
                      }}
                      image="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                      title="green iguana"
                    >
                      <Typography
                        sx={{
                          color: '#fff',
                          px: 2,
                          py: 1,
                        }}
                        variant="h6"
                      >
                        {board?.title}
                      </Typography>
                    </CardMedia>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        ''
      )}
      <NewBoardDialog open={openModal} setOpen={setOpenModal} />
    </Box>
  );
}
