import { Avatar, Box, Typography } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { convertHTMLToText, formatTimestamp } from '~/utils/formatters';

export default function ListReplyComments({ comment, showEmojiPicker }) {
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
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 0.5,
            }}
          >
            <Box
              sx={{
                fontSize: '12px !important',
                color: 'red',
                cursor: 'pointer',
                position: 'relative',
              }}
              onMouseEnter={() => handleReplyMouseEnter(reply._id)}
              onMouseLeave={handleReplyMouseLeave}
            >
              Like
              {showEmojiPicker && hoveredReplyCommentId === reply._id && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '100px',
                      height: '15px',
                      bgcolor: 'transparent',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    },
                  }}
                >
                  <EmojiPicker
                    reactionsDefaultOpen={true}
                    emojiStyle="facebook"
                    allowExpandReactions={false}
                    reactions={[
                      '1f44d',
                      '2764-fe0f',
                      '1f603',
                      '1f622',
                      '1f621',
                    ]}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
