import { saveToSupabaseTable } from "./libs/supabase.api";
import { mapTwitterUserToUser } from "./libs/transformer";
import { getFollowers, getUsersDetails } from "./libs/twitter.api";
import { TwitterUser, User } from "./libs/types";

const USER_ID = "60863876";

const main = async () => {
  const { data: followersData, error: followersError } = await getFollowers(
    USER_ID
  );
  if (followersError) {
    console.error(followersError);
    throw followersError;
  }

  const followersIds = followersData.data.map((follower) => follower.id);
  const { data: userDetails, error: usersDetailsError } = await getUsersDetails(
    followersIds
  );
  if (usersDetailsError) {
    console.error(usersDetailsError);
    throw usersDetailsError;
  }

  const usersDetails: User[] = userDetails.data.map((user: TwitterUser) =>
    mapTwitterUserToUser(user)
  );

  if (usersDetails.length) {
    const response = await saveToSupabaseTable(usersDetails);
    console.log(response);
  }
};

main();
