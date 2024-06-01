const emojiToReactionMap = {
  '1f44d': 'like', // 👍
  '2764-fe0f': 'love', // ❤️
  '1f603': 'haha', // 😃
  '1f622': 'sad', // 😢
  '1f621': 'angry', // 😡
};

const reactionToIconMap = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡',
};

export function convertReaction(emojiId) {
  return emojiToReactionMap[emojiId] || '👍';
}

const reactionToEmojiMap = Object.entries(emojiToReactionMap).reduce(
  (acc, [emoji, reaction]) => {
    acc[reaction] = emoji;
    return acc;
  },
  {}
);

const reactionToIcon = Object.entries(reactionToIconMap).reduce(
  (acc, [reaction, icon]) => {
    acc[reaction] = icon;
    return acc;
  },
  {}
);

export function convertToIcon(reaction) {
  return reactionToIcon[reaction] || '👍';
}

export function convertToEmoji(reaction) {
  return reactionToEmojiMap[reaction] || '👍';
}

export const reactionEmojis = reactionToIconMap;

export const REACTION_TYPES = Object.keys(reactionToIconMap);
