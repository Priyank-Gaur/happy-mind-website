const avatarModules = import.meta.glob<string>("../assets/avatars/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function getAvatarUrl(id: string): string | undefined {
  return avatarModules[`../assets/avatars/${id}.webp`];
}
