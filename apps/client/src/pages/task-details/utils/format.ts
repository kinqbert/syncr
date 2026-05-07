export const toDateInputValue = (value: string | null) => {
  return value ? value.slice(0, 10) : "";
};
