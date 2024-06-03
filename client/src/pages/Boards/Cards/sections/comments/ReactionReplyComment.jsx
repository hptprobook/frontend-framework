import { Box } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeReplyCommentReaction,
  updateReplyCommentReaction,
} from '~/redux/slices/cardSlice';
import socket from '~/socket/socket';
import {
  REACTION_TYPES,
  convertReaction,
  convertToIcon,
} from '~/utils/emojiConvert';

export default function ReactionReplyComment({
  reply,
  commentId,
  cardDetail,
  setCardDetail,
}) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.current);

  const [currentReplyCommentId, setCurrentReplyCommentId] = useState(null);
  const [userReaction, setUserReaction] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    REACTION_TYPES.forEach((reaction) => {
      if (
        reply.emotions[reaction].some((user) => user.userId === currentUser._id)
      ) {
        setUserReaction(reaction);
      }
    });

    socket.on('replyCommentReaction', (data) => {
      if (data && data._id === cardDetail._id) {
        setCardDetail(data);
      }
    });

    socket.on('removeReplyCommentReaction', (data) => {
      if (data && data._id === cardDetail._id) {
        setCardDetail(data);
      }
    });

    return () => {
      socket.off('replyCommentReaction');
      socket.off('removeReplyCommentReaction');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reply.emotions, currentUser._id]);

  const handleMouseEnter = useCallback((replyId) => {
    setCurrentReplyCommentId(replyId);
    setShowEmojiPicker(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowEmojiPicker(false);
    setCurrentReplyCommentId(null);
  }, []);

  const handleReaction = (emojiId) => {
    const reactionType = convertReaction(emojiId);
    if (!reactionType || reactionType === '👍') return;

    dispatch(
      updateReplyCommentReaction({
        id: cardDetail._id,
        commentId,
        replyId: reply._id,
        data: { reactionType },
      })
    );

    const updatedComments = cardDetail.comments.map((comment) => {
      if (comment._id === commentId) {
        const updatedReplies = comment.replies.map((r) => {
          if (r._id === reply._id) {
            REACTION_TYPES.forEach((reaction) => {
              const userIndex = r.emotions[reaction].findIndex(
                (user) => user.userId === currentUser._id
              );
              if (userIndex !== -1) {
                r.emotions[reaction].splice(userIndex, 1);
              }
            });
            r.emotions[reactionType].push({
              userId: currentUser._id,
              userName: currentUser.displayName,
            });
          }
          return r;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setCardDetail({ ...cardDetail, comments: updatedComments });
    setUserReaction(reactionType);
    setShowEmojiPicker(false);
    setCurrentReplyCommentId(null);
  };

  const handleRemoveReaction = () => {
    if (!userReaction) return;

    dispatch(
      removeReplyCommentReaction({
        id: cardDetail._id,
        commentId,
        replyId: reply._id,
      })
    );

    const updatedComments = cardDetail.comments.map((comment) => {
      if (comment._id === commentId) {
        const updatedReplies = comment.replies.map((r) => {
          if (r._id === reply._id) {
            const userIndex = r.emotions[userReaction].findIndex(
              (user) => user.userId === currentUser._id
            );
            if (userIndex !== -1) {
              r.emotions[userReaction].splice(userIndex, 1);
            }
          }
          return r;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setCardDetail({ ...cardDetail, comments: updatedComments });
    setUserReaction(''); // Reset the user's current reaction
    setShowEmojiPicker(false);
    setCurrentReplyCommentId(null);
  };

  return (
    <Box
      sx={{
        fontSize: '12px !important',
        color: 'red',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={() => handleMouseEnter(reply._id)}
      onMouseLeave={handleMouseLeave}
    >
      <Box onClick={handleRemoveReaction}>
        {userReaction ? convertToIcon(userReaction) : 'Like'}{' '}
      </Box>
      {showEmojiPicker && currentReplyCommentId === reply._id && (
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
            reactionsDefaultOpen
            onEmojiClick={(e) => handleReaction(e.unified)}
            emojiStyle="facebook"
            allowExpandReactions={false}
            reactions={['1f44d', '2764-fe0f', '1f603', '1f622', '1f621']}
          />
        </Box>
      )}
    </Box>
  );
}
