import { z } from "zod";
import {
  UserCreateValidator,
  UserPostApiDetails,
  UserValidator,
  UserView,
} from "../../../feat/user-list/types";
export async function createUser(
  user: z.infer<typeof UserCreateValidator>
): Promise<UserPostApiDetails> {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  if (!API_KEY || !API_BASE_URL) return { success: false };

  try {
    const response = await fetch(`${API_BASE_URL}users`, {
      method: "POST",
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
    console.error("Error creating user", error);
    return { success: false };
  }
}
