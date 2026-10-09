/**
 * Task names in seeded data often repeat the project ("Fix login - Billing").
 * Inside a project's own context that suffix is noise, so drop it.
 */
export const getTaskDisplayName = (name: string, projectName?: string | null) => {
  if (!projectName) {
    return name;
  }

  const suffix = ` - ${projectName}`;

  return name.endsWith(suffix) && name.length > suffix.length
    ? name.slice(0, -suffix.length)
    : name;
};
