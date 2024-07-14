import {
  User,
  UserListApiDetails,
  UserValidator,
  UserView,
} from "../../../feat/user-list/types";

interface UserListApiEntry {
  search?: string;
  lastCursor?: string;
}

export async function getUserList({
  search,
  lastCursor,
}: UserListApiEntry): Promise<UserListApiDetails> {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  let userListDetails: UserListApiDetails = {
    totalDBRowCount: 0,
    users: [],
    lastCursor: "",
    hasMore: false,
  };

  if (!API_KEY || !API_BASE_URL) return userListDetails;

  let queryParam = "";
  if (lastCursor && !search) {
    queryParam = `?after=${lastCursor}`;
  } else if (search && search !== "" && !lastCursor) {
    queryParam = `?full_name=${search}`;
  } else if (search && search !== "" && lastCursor) {
    queryParam = `?full_name=${search}&after=${lastCursor}`;
  }
  const response = await fetch(`${API_BASE_URL}users${queryParam}`, {
    headers: {
      "X-Api-Key": API_KEY,
    },
  });
  const data = await response.json();
  userListDetails.totalDBRowCount = data.total_count;
  // Mapp the data to the columns
  const mappedData = data.edges.map((user: any) => {
    if (!user.node || !UserValidator.safeParse(user.node).success) {
      // Go to the next iteration if the user is not valid
      console.error("Invalid user", user.node);
      return null;
    }
    return user.node;
  });

  userListDetails.users = mappedData.filter(
    (user: User | null) => user !== null
  ) as User[];
  userListDetails.lastCursor = data.page_info.end_cursor;
  userListDetails.hasMore = data.page_info.has_next_page;
  return userListDetails;
}
