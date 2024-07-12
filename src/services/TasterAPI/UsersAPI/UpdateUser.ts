import { z } from "zod";
import {
  UserCreateValidator,
  UserPostApiDetails,
  UserValidator,
  UserView,
  UserDetailsEditable,
} from "../../../feat/user-list/types";

interface UserPatchApiEntry {
  user: UserDetailsEditable;
  uuid: string;
}

export async function updateUser(
  entry: UserPatchApiEntry
): Promise<UserPostApiDetails> {
  const user = entry.user;
  const uuid = entry.uuid;

  const API_KEY = process.env.REACT_APP_API_KEY;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  if (!API_KEY || !API_BASE_URL) return { success: false };

  try {
    const response = await fetch(`${API_BASE_URL}users/${uuid}`, {
      method: "PATCH",
      headers: {
        "X-Api-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const userResponse = await response.json();
    if (!userResponse || !UserValidator.safeParse(userResponse).success) {
      console.error("Invalid user", userResponse.node);
      return { success: false };
    }
    const updated_at = new Date(userResponse.updated_at).toLocaleString();
    const userView: UserView = {
      picture_url: userResponse.picture_url || "",
      email: userResponse.email,
      full_name: userResponse.first_name + " " + userResponse.last_name,
      hobbies: userResponse.hobbies,
      updated_at: updated_at,
    };
    return { success: true, user: userView };
  } catch (error) {
    console.error("Error updating user", error);
    return { success: false };
  }
}
