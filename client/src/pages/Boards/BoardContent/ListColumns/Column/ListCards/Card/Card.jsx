import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupIcon from '@mui/icons-material/Group';
import CommentIcon from '@mui/icons-material/Comment';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AttachmentIcon from '@mui/icons-material/Attachment';

function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (
      <MuiCard
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
        }}
      >
        <CardContent
          sx={{
            p: 1.5,
            '&:last-child': {
              p: 1.5,
            },
          }}
        >
          <Typography>Học hack NASA bằng HTML</Typography>
        </CardContent>
      </MuiCard>
    );
  } else {
    return (
      <MuiCard
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
        }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image="https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2022/6/16/1/shutterstock_1862856634.jpg.rend.hgtvcom.1280.853.suffix/1655430860853.jpeg"
          title="green iguana"
        />
        <CardContent
          sx={{
            p: 1.5,
            '&:last-child': {
              p: 1.5,
            },
          }}
        >
          <Typography>Học hack NASA bằng HTML</Typography>
        </CardContent>
        <CardActions
          sx={{
            p: '0 4px 8px 4px',
          }}
        >
          <Button size="small" startIcon={<GroupIcon />}>
            8
          </Button>
          <Button size="small" startIcon={<CommentIcon />}>
            20
          </Button>
          <Button size="small" startIcon={<AttachmentIcon />}>
            12
          </Button>
        </CardActions>
      </MuiCard>
    );
  }
}

export default Card;
