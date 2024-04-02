import { Box, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

export default function Board() {
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
        <Grid item xs={3}>
          <Card sx={{ width: '100%', height: '274px' }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card sx={{ width: '100%', height: '274px' }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card
            sx={{
              width: '100%',
              height: '274px',
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
            >
              New Board
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
