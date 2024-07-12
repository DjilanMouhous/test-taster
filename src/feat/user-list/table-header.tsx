import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { UserCreateValidator, UserValidator, UserView } from "./types";
import AddUserDialog from "./dialogs/add-user";
import { z } from "zod";

interface TableHeaderProps {
  title?: string;
  searchCallback?: (search: string) => void;
  addNewUserCallback?: (
    user: z.infer<typeof UserCreateValidator>
  ) => Promise<boolean>;
}

export default function TableHeader({
  title,
  searchCallback,
  addNewUserCallback,
}: TableHeaderProps) {
  return (
    <div className="flex justify-between items-center border-b pb-2 mb-10">
      <div className="font-bold">{title}</div>
      <div className="flex gap-3 ">
        {searchCallback && (
          <Input
            type="text"
            placeholder="Search"
            className="border rounded-md p-2"
            onChange={(e) => searchCallback(e.target.value)}
          />
        )}
        {searchCallback && addNewUserCallback && (
          <hr className="w-[1px] h-auto bg-gray-300" />
        )}
        {addNewUserCallback && (
          <AddUserDialog addNewUserCallback={addNewUserCallback} />
        )}
      </div>
    </div>
  );
}
