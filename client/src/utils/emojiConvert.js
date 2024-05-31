const emojiToReactionMap = {
  '1f44d': 'like', // 👍
  '2764-fe0f': 'love', // ❤️
  '1f603': 'haha', // 😃
  '1f622': 'sad', // 😢
  '1f621': 'angry', // 😡
};

export function convertReaction(emojiId) {
  return emojiToReactionMap[emojiId] || 'unknown';
}

const reactionToEmojiMap = Object.entries(emojiToReactionMap).reduce(
  (acc, [emoji, reaction]) => {
    acc[reaction] = emoji;
    return acc;
  },
  {}
);

export function convertToEmoji(reaction) {
  return reactionToEmojiMap[reaction] || 'unknown';
}
