/* eslint-disable indent */
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import CommentIcon from '@mui/icons-material/Comment';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '~/redux/slices/cardSlice';
import ListComments from './ListComments';

export default function CardDetailComment({ card, cardDetail, setCardDetail }) {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.users);
  const [isComment, setComment] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [replyCommentId, setReplyCommentId] = useState(null);

  const handleAddComment = () => {
    const newComment = {
      content: commentContent,
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
      comments: [...cardDetail.comments, newComment],
    };
    setCardDetail(updatedCard);

    // eslint-disable-next-line no-unused-vars
    const { createdAt, ...commentWithoutCreatedAt } = newComment;

    dispatch(addComment({ id: card._id, data: commentWithoutCreatedAt }));
    setComment(false);
    setReplyCommentId(null);
    setCommentContent('');
  };

  const handleAddCommentKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    } else if (e.key === 'Escape') {
      setComment(false);
      setReplyCommentId(null);
      setCommentContent('');
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Grid container spacing={2} sx={{ px: 3, pt: 3 }}>
        <Grid item xs={1}>
          <CommentIcon />
        </Grid>
        <Grid item xs={8}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '18px !important' }}>
            Comments
          </Typography>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      <Grid container spacing={2} sx={{ px: 3, pt: 3 }}>
        <Grid item xs={1}></Grid>
        <Grid item xs={8}>
          <ListComments
            card={card}
            cardDetail={cardDetail}
            setCardDetail={setCardDetail}
            replyCommentId={replyCommentId}
            setReplyCommentId={setReplyCommentId}
            setComment={setComment}
          />

          {/* Comment form */}
          <Box sx={{ mt: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar
                sx={{
                  width: '30px',
                  height: '30px',
                  fontSize: '12px',
                  bgcolor: 'red',
                }}
                src={current?.photoURL}
              />
              {!isComment ? (
                <Box
                  sx={{
                    py: 1,
                    px: 3,
                    borderRadius: '8px',
                    border: '1px solid #e4e6ea',
                    bgcolor: '#e4e6ea',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                  onClick={() => {
                    setComment(true);
                    setReplyCommentId(null); // Reset reply comment ID
                  }}
                >
                  <Typography>Type comment here ...</Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <TextField
                    fullWidth
                    autoFocus
                    value={commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                    onKeyUp={handleAddCommentKeyUp}
                    style={{ marginBottom: '12px' }}
                  />
                  <Box>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={handleAddComment}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setComment(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </Box>
  );
}
