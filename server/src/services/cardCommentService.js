import { ObjectId } from 'mongodb';
import { cardModel } from '~/models/cardModel';
import { cardSchema } from '~/models/schema/cardSchema';
import { userModal } from '~/models/userModal';
import { REACTION_TYPES } from '~/utils/constants';

const validateComment = async (data) => {
  return await cardSchema.COMMENT_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const validateReplyComment = async (data) => {
  return await cardSchema.REPLY_COMMENT_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const addComment = async (cardId, commentData) => {
  try {
    const validCommentData = await validateComment(commentData);

    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    card.comments.push({ ...validCommentData, _id: new ObjectId() });

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

const updateComment = async (cardId, commentId, updateData) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const commentIndex = card.comments.findIndex((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );
    if (commentIndex === -1) {
      throw new Error(`Comment not found in card ${cardId}`);
    }

    updateData.updatedAt = Date.now();
    Object.assign(card.comments[commentIndex], updateData);

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

const updateReplyComment = async (cardId, commentId, replyId, updateData) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const commentIndex = card.comments.findIndex((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );
    if (commentIndex === -1) {
      throw new Error(`Comment not found in card ${cardId}`);
    }

    const comment = card.comments[commentIndex];
    const replyIndex = comment.replies.findIndex((reply) =>
      reply._id.equals(new ObjectId(replyId))
    );

    if (replyIndex === -1) {
      throw new Error(`Reply not found in comment ${commentId}`);
    }

    updateData.updatedAt = Date.now();
    Object.assign(comment.replies[replyIndex], updateData);

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

const updateCommentReaction = async (
  cardId,
  commentId,
  userId,
  reactionType
) => {
  try {
    if (!REACTION_TYPES.includes(reactionType)) {
      throw new Error(`Invalid reaction type ${reactionType}`);
    }

    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const user = await userModal.findOneById(userId); // Changed userModal to userModel
    if (!user) {
      throw new Error(`User not found for id ${userId}`);
    }

    const commentIndex = card.comments.findIndex((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );
    if (commentIndex === -1) {
      throw new Error(`Comment not found in card ${cardId}`);
    }

    const comment = card.comments[commentIndex];

    // Remove the user's previous reactions
    REACTION_TYPES.forEach((reaction) => {
      const userReactionIndex = comment.emotions[reaction].findIndex(
        (reaction) => reaction.userId === userId
      );
      if (userReactionIndex !== -1) {
        comment.emotions[reaction].splice(userReactionIndex, 1);
      }
    });

    // Add the new reaction
    comment.emotions[reactionType].push({ userId, userName: user.displayName });

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

const replyComment = async (cardId, commentId, replyData) => {
  try {
    const validReplyCommentData = await validateReplyComment(replyData);

    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const commentIndex = card.comments.findIndex((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );
    if (commentIndex === -1) {
      throw new Error(`Comment not found in card ${cardId}`);
    }

    card.comments[commentIndex].replies.push({
      ...validReplyCommentData,
      _id: new ObjectId(),
    });

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

const updateReplyCommentReaction = async (
  cardId,
  commentId,
  replyId,
  userId,
  reactionType
) => {
  try {
    if (!REACTION_TYPES.includes(reactionType)) {
      throw new Error(`Invalid reaction type ${reactionType}`);
    }

    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const user = await userModal.findOneById(userId);
    if (!user) {
      throw new Error(`User not found for id ${userId}`);
    }

    const commentIndex = card.comments.findIndex((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );
    if (commentIndex === -1) {
      throw new Error(`Comment not found in card ${cardId}`);
    }

    const comment = card.comments[commentIndex];
    const replyIndex = comment.replies.findIndex((reply) =>
      reply._id.equals(new ObjectId(replyId))
    );

    if (replyIndex === -1) {
      throw new Error(`Reply not found in comment ${commentId}`);
    }

    const reply = comment.replies[replyIndex];

    // Remove the user's previous reactions
    REACTION_TYPES.forEach((reaction) => {
      const userReactionIndex = reply.emotions[reaction].findIndex(
        (reaction) => reaction.userId === userId
      );
      if (userReactionIndex !== -1) {
        reply.emotions[reaction].splice(userReactionIndex, 1);
      }
    });

    // Add the new reaction
    reply.emotions[reactionType].push({ userId, userName: user.displayName });

    // Persist changes
    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};
const removeCommentReaction = async (cardId, commentId, userId) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const commentIndex = card.comments.findIndex((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );
    if (commentIndex === -1) {
      throw new Error(`Comment not found in card ${cardId}`);
    }

    const comment = card.comments[commentIndex];

    // Remove the user's previous reactions
    REACTION_TYPES.forEach((reaction) => {
      const userReactionIndex = comment.emotions[reaction].findIndex(
        (reaction) => reaction.userId === userId
      );
      if (userReactionIndex !== -1) {
        comment.emotions[reaction].splice(userReactionIndex, 1);
      }
    });

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

const removeReplyCommentReaction = async (
  cardId,
  commentId,
  replyId,
  userId
) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const commentIndex = card.comments.findIndex((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );
    if (commentIndex === -1) {
      throw new Error(`Comment not found in card ${cardId}`);
    }

    const comment = card.comments[commentIndex];
    const replyIndex = comment.replies.findIndex((reply) =>
      reply._id.equals(new ObjectId(replyId))
    );

    if (replyIndex === -1) {
      throw new Error(`Reply not found in comment ${commentId}`);
    }

    const reply = comment.replies[replyIndex];

    // Remove the user's previous reactions
    REACTION_TYPES.forEach((reaction) => {
      const userReactionIndex = reply.emotions[reaction].findIndex(
        (reaction) => reaction.userId === userId
      );
      if (userReactionIndex !== -1) {
        reply.emotions[reaction].splice(userReactionIndex, 1);
      }
    });

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteComment = async (cardId, commentId) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    card.comments = card.comments.filter(
      (comment) => !comment._id.equals(new ObjectId(commentId))
    );

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteReplyComment = async (cardId, commentId, replyId) => {
  try {
    const card = await cardModel.findOneById(cardId);
    if (!card) {
      throw new Error(`Card not found for id ${cardId}`);
    }

    const commentIndex = card.comments.findIndex((comment) =>
      comment._id.equals(new ObjectId(commentId))
    );
    if (commentIndex === -1) {
      throw new Error(`Comment not found in card ${cardId}`);
    }

    const comment = card.comments[commentIndex];
    const replyIndex = comment.replies.findIndex((reply) =>
      reply._id.equals(new ObjectId(replyId))
    );

    if (replyIndex === -1) {
      throw new Error(`Reply not found in comment ${commentId}`);
    }

    // Remove the reply
    comment.replies.splice(replyIndex, 1);

    return await cardModel.update(cardId, { comments: card.comments });
  } catch (error) {
    throw new Error(error);
  }
};

export const cardCommentServices = {
  addComment,
  updateComment,
  updateCommentReaction,
  replyComment,
  updateReplyComment,
  removeCommentReaction,
  removeReplyCommentReaction,
  updateReplyCommentReaction,
  deleteComment,
  deleteReplyComment,
};
