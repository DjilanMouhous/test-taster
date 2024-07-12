import React from "react";
import { DataTable } from "./data-table";
import {
  User,
  UserCreateValidator,
  UserPostApiDetails,
  UserView,
} from "./types";
import TableHeader from "./table-header";
import { columns } from "./columns";
import { getUserList } from "../../services/TasterAPI/UsersAPI/GetUserList";
import { set, z } from "zod";
import { createUser } from "../../services/TasterAPI/UsersAPI/CreateUser";

export default function UserListTable() {
  const isFirstRun = React.useRef(true);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [totalFetched, setTotalFetched] = React.useState<number>(0);
  const [totalDBRowCount, setTotalDBRowCount] = React.useState<number>(0);
  const [data, setData] = React.useState<User[]>([]);
  const [lastCursor, setLastCursor] = React.useState<string>("");
  const [hasMore, setHasMore] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>("");
  const [isSearchDirty, setIsSearchDirty] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!isFirstRun.current) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
    }
    getUserList({}).then((data) => {
      setData(data.users);
      setTotalDBRowCount(data.totalDBRowCount);
      setTotalFetched((oldTotal) => oldTotal + data.users.length);
      setLastCursor(data.lastCursor);
      setHasMore(data.hasMore);
    });
  }, []);
  React.useEffect(() => {
    if (search === "" && !isSearchDirty) return;
    setIsSearchDirty(true);
    console.log("search", search);
    getUserList({ search: search }).then((data) => {
      setData(data.users);
      setTotalFetched(data.users.length);
      setLastCursor(data.lastCursor);
      setHasMore(data.hasMore);
    });
  }, [search]);
  const fetchNextPage = () => {
    setIsFetching(true);
    const lastUser = lastCursor;
    getUserList({ lastCursor: lastUser, search: search }).then((data) => {
      setData((oldData) => [...oldData, ...data.users]);
      setTotalFetched((oldTotal) => oldTotal + data.users.length);
      setIsFetching(false);
      setLastCursor(data.lastCursor);
      setHasMore(data.hasMore);
    });
  };
  const fetchMoreOnBottomReached = (
    containerRefElement?: HTMLDivElement | null
  ) => {
    if (containerRefElement) {
      const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
      //once the user has scrolled within 192px of the bottom of the table, fetch more data if we can
      if (
        scrollHeight - scrollTop - clientHeight < 192 &&
        !isFetching &&
        totalFetched < totalDBRowCount
      ) {
        fetchNextPage();
      }
    }
  };
  const addNewUser = async (
    user: z.infer<typeof UserCreateValidator>
  ): Promise<boolean> => {
    const userCreatedDetails: UserPostApiDetails = await createUser(user);

    console.log("User created", userCreatedDetails.success);
    if (userCreatedDetails.success) {
      setTotalDBRowCount((oldTotal) => oldTotal + 1);
    }
    return userCreatedDetails.success;
  };

  return (
    <div>
      <TableHeader
        title={`User List (${totalFetched}/${totalDBRowCount})`}
        searchCallback={setSearch}
        addNewUserCallback={addNewUser}
      />
      <div
        ref={tableContainerRef}
        onScroll={
          hasMore
            ? () => fetchMoreOnBottomReached(tableContainerRef.current)
            : undefined
        }
        className="max-h-96 overflow-auto"
      >
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
