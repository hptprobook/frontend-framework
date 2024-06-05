import { StatusCodes } from 'http-status-codes';
import { cardCommentServices } from '~/services/cardCommentService';

const addComment = async (req, res, next) => {
  try {
    const addedComment = await cardCommentServices.addComment(
      req.params.id,
      req.body
    );

    if (addedComment) {
      req.io.emit('comment', addedComment);
    }

    res.status(StatusCodes.OK).json(addedComment);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.updateComment(
      req.params.id,
      req.params.commentId,
      req.body
    );

    req.io.emit('updateComment', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await cardCommentServices.deleteComment(
      req.params.id,
      req.params.commentId
    );

    req.io.emit('deleteComment', req.params.commentId);

    res.status(StatusCodes.NO_CONTENT).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateCommentReaction = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.updateCommentReaction(
      req.params.id,
      req.params.commentId,
      req.userId,
      req.body.reactionType
    );

    req.io.emit('commentReaction', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const replyComment = async (req, res, next) => {
  try {
    const comment = await cardCommentServices.replyComment(
      req.params.id,
      req.params.commentId,
      req.body
    );

    if (comment) {
      req.io.emit('replyComment', comment);
    }

    res.status(StatusCodes.OK).json(comment);
  } catch (error) {
    next(error);
  }
};

const updateReplyComment = async (req, res, next) => {
  try {
    const updatedReply = await cardCommentServices.updateReplyComment(
      req.params.id,
      req.params.commentId,
      req.params.replyId,
      req.body
    );

    req.io.emit('updateReplyComment', updatedReply);

    res.status(StatusCodes.OK).json(updatedReply);
  } catch (error) {
    next(error);
  }
};

const deleteReplyComment = async (req, res, next) => {
  try {
    await cardCommentServices.deleteReplyComment(
      req.params.id,
      req.params.commentId,
      req.params.replyId
    );

    req.io.emit('deleteReplyComment', req.params.replyId);

    res.status(StatusCodes.NO_CONTENT).json({ success: true });
  } catch (error) {
    next(error);
  }
};

const updateReplyCommentReaction = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.updateReplyCommentReaction(
      req.params.id,
      req.params.commentId,
      req.params.replyId,
      req.userId,
      req.body.reactionType
    );

    req.io.emit('replyCommentReaction', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const removeCommentReaction = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.removeCommentReaction(
      req.params.id,
      req.params.commentId,
      req.userId
    );

    req.io.emit('removeCommentReaction', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

const removeReplyCommentReaction = async (req, res, next) => {
  try {
    const updatedComment = await cardCommentServices.removeReplyCommentReaction(
      req.params.id,
      req.params.commentId,
      req.params.replyId,
      req.userId
    );

    req.io.emit('removeReplyCommentReaction', updatedComment);

    res.status(StatusCodes.OK).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const cardCommentController = {
  addComment,
  updateComment,
  deleteComment,
  updateCommentReaction,
  replyComment,
  updateReplyComment,
  deleteReplyComment,
  updateReplyCommentReaction,
  removeCommentReaction,
  removeReplyCommentReaction,
};
