import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCut from '@mui/icons-material/ContentCut';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ListItemText from '@mui/material/ListItemText';
import Cloud from '@mui/icons-material/Cloud';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AddCardIcon from '@mui/icons-material/AddCard';
import Button from '@mui/material/Button';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupIcon from '@mui/icons-material/Group';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';

const COLUMN_HEADER_HEIGHT = '48px';
const COLUMN_FOOTER_HEIGHT = '60px';

function BoardColumn() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        minWidth: '300px',
        maxWidth: '300px',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
        ml: 2,
        borderRadius: '6px',
        height: 'fit-content',
        maxHeight: (theme) => `calc(${theme.height.boardContentHeight} - ${theme.spacing(5)})`,
      }}
    >
      {/* Box Column Header */}
      <Box
        sx={{
          height: COLUMN_HEADER_HEIGHT,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Column Title
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <Tooltip title="More options">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                <ExpandMoreIcon
                  sx={{
                    color: 'text.primary',
                    cursor: 'pointer',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="column-dropdown"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <ListItemIcon>
                <AddCardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Add new card</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCut fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cut</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentPasteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Paste</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Cloud fontSize="small" />
              </ListItemIcon>
              <ListItemText>Archive this column</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Remove this column</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Box List Card 1 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: '0 5px',
          m: '0 5px',
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) =>
            `calc(${theme.height.boardContentHeight} - ${theme.spacing(5)} - ${COLUMN_FOOTER_HEIGHT} - ${COLUMN_HEADER_HEIGHT})`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ced0da',
            borderRadius: '24px',
            cursor: 'pointer',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfc2cf',
          },
        }}
      >
        <Card
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
        </Card>

        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset',
          }}
        >
          <CardContent
            sx={{
              p: 1,
              '&:last-child': {
                p: 1.5,
              },
            }}
          >
            <Typography>Card 01</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Box Column Footer */}
      <Box
        sx={{
          height: COLUMN_FOOTER_HEIGHT,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button startIcon={<AddCardIcon />}>Add new card</Button>
        <Tooltip title={'Drag to move'}>
          <DragHandleIcon
            sx={{
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
}

export default BoardColumn;
