import config from "../config";
import axios from "axios";

const { TWITTER_API_URL, TWITTER_API_TOKEN } = config;

export const getUserId = async (username: string) => {
  const response = {
    data: null,
    error: null,
  };

  try {
    const requestHeaders = {
      Authorization: `Bearer ${TWITTER_API_TOKEN}`,
    };
    const url = new URL(`${TWITTER_API_URL}/users/by/username/${username}`);
    const { data } = await axios.get(url.toString(), {
      headers: requestHeaders,
    });
    response.data = data;
  } catch (error) {
    console.error(error);
    response.error = error;
  }

  return response;
};

export const getUserDetails = async (id: string) => {
  const response = {
    data: null,
    error: null,
  };

  try {
    const requestHeaders = {
      Authorization: `Bearer ${TWITTER_API_TOKEN}`,
    };
    const url = new URL(`${TWITTER_API_URL}/users/by/id/${id}`);
    url.searchParams.append(
      "user.fields",
      "created_at,description,location,profile_image_url,url,verified"
    );
    const { data } = await axios.get(url.toString(), {
      headers: requestHeaders,
    });
    response.data = data;
  } catch (error) {
    console.error(error);
    response.error = error;
  }

  return response;
};

export const getUsersDetails = async (ids: string[]) => {
  const response = {
    data: null,
    error: null,
  };

  try {
    const url = new URL(`${TWITTER_API_URL}/users`);
    url.searchParams.append("ids", ids.join(","));
    url.searchParams.append(
      "user.fields",
      "created_at,description,location,profile_image_url,url,verified"
    );
    const requestHeaders = {
      Authorization: `Bearer ${TWITTER_API_TOKEN}`,
    };

    const { data } = await axios.get(url.toString(), {
      headers: requestHeaders,
    });
    response.data = data;
  } catch (error) {
    console.error(error);
    response.error = error;
  }
  return response;
};

export const getFollowers = async (id: string) => {
  const response = {
    data: null,
    error: null,
  };

  try {
    const url = new URL(`${TWITTER_API_URL}/users/${id}/followers`);
    const requestHeaders = {
      Authorization: `Bearer ${TWITTER_API_TOKEN}`,
    };
    const { data } = await axios.get(url.toString(), {
      headers: requestHeaders,
    });
    response.data = data;
  } catch (error) {
    console.error(error);
    response.error = error;
  }
  return response;
};
