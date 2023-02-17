import { TwitterUser, User } from "./types";

export const mapTwitterUserToUser = (user: TwitterUser): User => {
  const userImage = user.profile_image_url.replace("_normal", "_400x400");

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    created_at: user.created_at,
    description: user.description,
    location: user.location,
    profile_image_url: userImage,
    url: user.url,
    verified: user.verified,
  };
};
