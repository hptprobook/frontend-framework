import { Avatar, Box, Typography } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { convertHTMLToText, formatTimestamp } from '~/utils/formatters';
import ReactionReplyComment from './ReactionReplyComment';

export default function ListReplyComments({
  comment,
  cardDetail,
  setCardDetail,
  isShowListUser,
  setShowEmojiPicker,
  showEmojiPicker,
  renderReactions,
}) {
  const [hoveredReplyCommentId, setHoveredReplyCommentId] = useState(null);

  const handleReplyMouseEnter = (replyId) => {
    setHoveredReplyCommentId(replyId);
  };

  const handleReplyMouseLeave = () => {
    setHoveredReplyCommentId(null);
  };

  return (
    <Box>
      {comment.replies?.map((reply, id) => (
        <Box
          key={id}
          sx={{
            ml: 6,
            mt: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: '30px',
                height: '30px',
                fontSize: '14px',
                bgcolor: 'red',
              }}
            >
              {reply?.userName.charAt(0)}
            </Avatar>
            <Typography variant="body2">{reply?.userName}</Typography>
            <Typography variant="caption">
              {formatTimestamp(reply?.createdAt)}
            </Typography>
          </Box>
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
            <Box>{convertHTMLToText(reply?.content)}</Box>
            <Box
              sx={{
                pb: 0.5,
                mt: 0.2,
                display: 'flex',
                gap: 1,
              }}
            >
              {renderReactions(reply._id, reply.emotions)}
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 0.5,
            }}
          >
            <ReactionReplyComment
              comment={comment}
              cardDetail={cardDetail}
              setCardDetail={setCardDetail}
              isShowListUser={isShowListUser}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
