import { Box } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCommentReaction } from '~/redux/slices/cardSlice';
import {
  REACTION_TYPES,
  convertReaction,
  convertToIcon,
} from '~/utils/emojiConvert';

export default function ReactionReplyComment({
  comment,
  cardDetail,
  setCardDetail,
  setShowEmojiPicker,
  showEmojiPicker,
}) {
  const dispatch = useDispatch();
  const { current } = useSelector((state) => state.users);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [isReply, setIsReply] = useState(false);
  const [userReaction, setUserReaction] = useState('');

  useEffect(() => {
    // Check if the user has already reacted
    REACTION_TYPES.forEach((reaction) => {
      if (
        comment.emotions[reaction].some(
          (reactionUser) => reactionUser.userId === current._id
        )
      ) {
        setUserReaction(reaction);
      }
    });
  }, [comment.emotions, current._id]);

  const handleMouseEnter = (commentId, isReplyComment = false) => {
    setCurrentCommentId(commentId);
    setIsReply(isReplyComment);
    setShowEmojiPicker(true);
  };

  const handleMouseLeave = () => {
    setShowEmojiPicker(false);
    setCurrentCommentId(null);
    setIsReply(false);
  };

  const handleReaction = (emojiId) => {
    const reactionType = convertReaction(emojiId);
    if (!reactionType || reactionType === '👍') return;

    dispatch(
      updateCommentReaction({
        id: cardDetail._id,
        commentId: comment._id,
        data: { reactionType },
      })
    );

    const updatedComments = cardDetail?.comments.map((c) => {
      if (c._id === comment._id) {
        // Remove previous reactions from the user
        REACTION_TYPES.forEach((reaction) => {
          const userIndex = c.emotions[reaction].findIndex(
            (reactionUser) => reactionUser.userId === current._id
          );
          if (userIndex !== -1) {
            c.emotions[reaction].splice(userIndex, 1);
          }
        });

        // Add the new reaction
        c.emotions[reactionType].push({
          userId: current._id,
          userName: current.displayName,
        });
      }
      return c;
    });

    setCardDetail({ ...cardDetail, comments: updatedComments });
    setUserReaction(reactionType); // Set the user's current reaction
    setShowEmojiPicker(false);
    setCurrentCommentId(null);
    setIsReply(false);
  };

  return (
    <Box>
      <Box
        sx={{
          fontSize: '12px !important',
          color: 'red',
          cursor: 'pointer',
          position: 'relative',
        }}
        onMouseEnter={() => handleMouseEnter(comment._id)}
        onMouseLeave={handleMouseLeave}
      >
        {userReaction ? convertToIcon(userReaction) : 'Like'}{' '}
        {showEmojiPicker && currentCommentId === comment._id && !isReply && (
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
              onEmojiClick={(e) => handleReaction(e.unified)}
              emojiStyle="facebook"
              allowExpandReactions={false}
              reactions={['1f44d', '2764-fe0f', '1f603', '1f622', '1f621']}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
