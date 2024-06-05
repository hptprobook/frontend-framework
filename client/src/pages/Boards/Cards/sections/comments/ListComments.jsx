/* eslint-disable indent */
import {
  Avatar,
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { replyComment } from '~/redux/slices/cardSlice';
import { convertHTMLToText, formatTimestamp } from '~/utils/formatters';
import ListReplyComments from './ListReplyComments';
import ReactionComment from './ReactionComment';
import { REACTION_TYPES, reactionEmojis } from '~/utils/emojiConvert';

export default function ListComments({
  card,
  cardDetail,
  setCardDetail,
  replyCommentId,
  setReplyCommentId,
  setComment,
}) {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.users);
  const [isShowListUser, setShowListUser] = useState(false);
  const [replyCommentContent, setReplyCommentContent] = useState('');
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const [hoveredCommentId, setHoveredCommentId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditComment = (comment) => {
    setEditedCommentContent(comment.content);
    setEditingCommentId(comment._id);
    handleMenuClose();
  };

  const handleDeleteComment = (commentId) => {
    // Add logic to delete the comment
    handleMenuClose();
  };

  const handleSaveEditedComment = (commentId) => {
    // Add logic to save the edited comment
    setEditingCommentId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleReplyComment = () => {
    const newReplyComment = {
      content: replyCommentContent,
      userId: current._id,
      userName: current.displayName,
      photoURL: current.photoURL,
      emotions: {
        like: [],
        love: [],
        haha: [],
        wow: [],
        sad: [],
        angry: [],
      },
      createdAt: new Date().toISOString(),
    };

    const updatedCard = {
      ...cardDetail,
      comments: cardDetail.comments.map((comment) =>
        comment._id === replyCommentId
          ? {
              ...comment,
              replies: [...comment.replies, newReplyComment],
            }
          : comment
      ),
    };

    // eslint-disable-next-line no-unused-vars
    const { createdAt, ...replyWithoutCreatedAt } = newReplyComment;
    dispatch(
      replyComment({
        id: card._id,
        commentId: replyCommentId,
        data: replyWithoutCreatedAt,
      })
    );

    setCardDetail(updatedCard);
    setReplyCommentId(null);
    setReplyCommentContent('');
  };

  const handleKeyUpReply = (event) => {
    if (event.key === 'Enter') {
      handleReplyComment();
    }
  };

  const renderReactions = (commentId, emotions) => {
    return REACTION_TYPES.map((reactionType) => {
      const count = emotions[reactionType].length;
      return count > 0 ? (
        <Box key={reactionType} position="relative">
          <Chip
            sx={{
              cursor: 'pointer',
            }}
            label={`${reactionEmojis[reactionType]} ${count}`}
            size="small"
            onMouseEnter={() => {
              setShowListUser(true);
              setHoveredReaction(reactionType);
              setHoveredCommentId(commentId);
            }}
            onMouseLeave={() => {
              setShowListUser(false);
              setHoveredReaction(null);
              setHoveredCommentId(null);
            }}
          />
          {isShowListUser &&
            hoveredReaction === reactionType &&
            hoveredCommentId === commentId && (
              <Box
                sx={{
                  position: 'absolute',
                  width: '150px',
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  px: 2,
                  mt: 1,
                  py: 1,
                  borderRadius: '4px',
                  boxShadow: 1,
                  zIndex: 1000,
                  color: '#fff',
                }}
              >
                {emotions[reactionType].map((user, id) => (
                  <Typography key={id} sx={{ fontSize: '12px !important' }}>
                    {user.userName}
                  </Typography>
                ))}
              </Box>
            )}
        </Box>
      ) : null;
    });
  };

  return (
    <Box>
      {cardDetail?.comments
        ? cardDetail.comments.map((comment, id) => (
            <React.Fragment key={id}>
              <Box sx={{ my: 1, position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: '31px',
                      height: '31px',
                      fontSize: '16px',
                      bgcolor: 'red',
                    }}
                    src={comment?.photoURL}
                  />
                  <Typography
                    sx={{
                      fontSize: '15px !important',
                      fontWeight: 600,
                    }}
                  >
                    {comment?.userName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '11px !important',
                      fontWeight: 400,
                    }}
                  >
                    {formatTimestamp(comment?.createdAt)}
                  </Typography>
                </Box>
                {editingCommentId === comment._id ? (
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
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      style={{ marginBottom: '12px' }}
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => handleSaveEditedComment(comment._id)}
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
                    <Box>{convertHTMLToText(comment?.content)}</Box>
                    <Box
                      sx={{
                        pb: 0.5,
                        mt: 0.2,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      {renderReactions(comment._id, comment.emotions)}
                    </Box>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                      onClick={handleMenuOpen}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={isMenuOpen}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleEditComment(comment)}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        Delete
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 0.5,
                  }}
                >
                  <ReactionComment
                    comment={comment}
                    cardDetail={cardDetail}
                    setCardDetail={setCardDetail}
                    isShowListUser={isShowListUser}
                  />
                  <Typography
                    sx={{
                      fontSize: '12px !important',
                      color: 'blue',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setReplyCommentId(comment._id);
                      setComment(false);
                    }}
                  >
                    Reply
                  </Typography>
                </Box>
              </Box>

              <ListReplyComments
                comment={comment}
                cardDetail={cardDetail}
                setCardDetail={setCardDetail}
                renderReactions={renderReactions}
              />

              {replyCommentId === comment._id && (
                <Box sx={{ mt: 1, ml: 9 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: '30px',
                        height: '30px',
                        fontSize: '16px',
                        bgcolor: 'red',
                      }}
                    >
                      You
                    </Avatar>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                      }}
                    >
                      <TextField
                        fullWidth
                        value={replyCommentContent}
                        autoFocus
                        onChange={(event) =>
                          setReplyCommentContent(event.target.value)
                        }
                        onKeyUp={handleKeyUpReply}
                        style={{ marginBottom: '12px' }}
                      />
                      <Box>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mr: 1 }}
                          onClick={handleReplyComment}
                        >
                          Save
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setReplyCommentId(null)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </React.Fragment>
          ))
        : ''}
    </Box>
  );
}
