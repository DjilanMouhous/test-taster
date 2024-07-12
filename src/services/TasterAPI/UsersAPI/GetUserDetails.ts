import {
  UserApiDetails,
  UserValidator,
  UserView,
} from "../../../feat/user-list/types";
export async function getUserDetails(uuid: string): Promise<UserApiDetails> {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  let userApiDetails: UserApiDetails = {
    success: false,
  };

  if (!API_KEY || !API_BASE_URL) return userApiDetails;

  try {
    const response = await fetch(`${API_BASE_URL}users/${uuid}`, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });
    const data = await response.json();
    if (!UserValidator.safeParse(data).success) {
      return userApiDetails;
    } else {
      userApiDetails.success = true;
      userApiDetails.user = data;
    }
  } catch (error) {
    console.error("Error fetching user details", error);
    return userApiDetails;
  }
  return userApiDetails;
}
