export const buildDirectConversationKey = (firstUserId: number, secondUserId: number) => {
  const [smallerId, largerId] = [firstUserId, secondUserId].sort((a, b) => a - b);

  return `${smallerId}:${largerId}`;
};
