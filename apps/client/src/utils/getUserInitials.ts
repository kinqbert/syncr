export const getUserInitials = (name: string, surname: string) => {
  return `${name.trim().charAt(0)}${surname.trim().charAt(0)}`.toUpperCase();
};
