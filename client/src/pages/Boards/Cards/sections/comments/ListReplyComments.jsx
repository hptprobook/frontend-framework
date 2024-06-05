import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  ListItemIcon,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { convertHTMLToText, formatTimestamp } from '~/utils/formatters';
import ReactionReplyComment from './ReactionReplyComment';
import { deleteReplyCommentAPI, updateReplyCommentAPI } from '~/apis/cardApi';

export default function ListReplyComments({
  comment,
  cardDetail,
  setCardDetail,
  isShowListUser,
  renderReactions,
}) {
  const [anchorEl, setAnchorEl] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyContent, setEditedReplyContent] = useState('');

  const handleMenuOpen = (event, replyId) => {
    setAnchorEl((prev) => ({ ...prev, [replyId]: event.currentTarget }));
  };

  const handleMenuClose = (replyId) => {
    setAnchorEl((prev) => ({ ...prev, [replyId]: null }));
  };

  const handleEditReply = (reply) => {
    setEditedReplyContent(reply.content);
    setEditingReplyId(reply._id);
    handleMenuClose(reply._id);
  };

  const handleDeleteReply = async (replyId) => {
    await deleteReplyCommentAPI({
      id: cardDetail._id,
      commentId: comment._id,
      replyId,
    });

    const updatedCard = {
      ...cardDetail,
      comments: cardDetail.comments.map((comment) => {
        if (comment._id === comment._id) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply._id !== replyId),
          };
        }
        return comment;
      }),
    };

    setCardDetail(updatedCard);
    handleMenuClose(replyId);
  };

  const handleSaveEditedReply = async (replyId) => {
    const updatedReply = await updateReplyCommentAPI({
      id: cardDetail._id,
      commentId: comment._id,
      replyId,
      data: { content: editedReplyContent },
    });

    setCardDetail(updatedReply);
    setEditingReplyId(null);
  };

  const handleCancelEdit = () => {
    setEditingReplyId(null);
  };

  return (
    <Box>
      {comment.replies?.map((reply, id) => (
        <Box key={id} sx={{ ml: 6, mt: 1, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: '30px',
                height: '30px',
                fontSize: '14px',
                bgcolor: 'red',
              }}
            >
              {reply.userName.charAt(0)}
            </Avatar>
            <Typography variant="body2">{reply.userName}</Typography>
            <Typography variant="caption">
              {formatTimestamp(reply.createdAt)}
            </Typography>
          </Box>
          {editingReplyId === reply._id ? (
            <Box
              sx={{
                mt: 1,
                py: 2,
                px: 3,
                borderRadius: '8px',
                border: '1px solid #e4e6ea',
                bgcolor: '#f0f0f0',
              }}
            >
              <TextField
                fullWidth
                value={editedReplyContent}
                autoFocus
                onChange={(e) => setEditedReplyContent(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <Button
                size="small"
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => handleSaveEditedReply(reply._id)}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                mt: 1,
                py: 2,
                px: 3,
                borderRadius: '8px',
                border: '1px solid #e4e6ea',
                bgcolor: '#f0f0f0',
                position: 'relative',
              }}
            >
              <Box>{convertHTMLToText(reply.content)}</Box>
              <Box sx={{ pb: 0.5, mt: 0.2, display: 'flex', gap: 1 }}>
                {renderReactions(reply._id, reply.emotions)}
              </Box>
              <IconButton
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                onClick={(event) => handleMenuOpen(event, reply._id)}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl[reply._id]}
                open={Boolean(anchorEl[reply._id])}
                onClose={() => handleMenuClose(reply._id)}
              >
                <MenuItem onClick={() => handleEditReply(reply)}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit
                </MenuItem>
                <MenuItem onClick={() => handleDeleteReply(reply._id)}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
            <ReactionReplyComment
              commentId={comment._id}
              reply={reply}
              cardDetail={cardDetail}
              setCardDetail={setCardDetail}
              isShowListUser={isShowListUser}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
