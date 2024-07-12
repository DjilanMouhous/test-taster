import { ColumnDef } from "@tanstack/react-table";
import { User, UserDetailsEditable } from "./types";
import UpdateUserDialog from "./dialogs/update-user";
import { getUserDetails } from "../../services/TasterAPI/UsersAPI/GetUserDetails";
import React from "react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "picture_url",
    header: "",
    cell: ({ row }) => {
      let src: string = row.getValue("picture_url");
      if (!src) {
        src =
          "https://ui-avatars.com/api/?name=" +
          row.original.first_name +
          "+" +
          row.original.last_name +
          "&background=random&color=fff";
      }
      return (
        <img
          className="w-10 h-10 rounded-full mx-auto"
          src={src}
          alt="Profile Picture"
        />
      );
    },
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => {
      return row.original.first_name + " " + row.original.last_name;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "hobbies",
    header: "Hobbies",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-2">
          {row.original.hobbies.map((hobby, index) => (
            <div key={index} className="bg-accent text-xs rounded-lg px-2 py-1">
              {hobby}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last update",
    cell: ({ row }) => {
      const formatted_date = new Date(
        row.original.updated_at
      ).toLocaleDateString();
      const formatted_time = new Date(
        row.original.updated_at
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return (
        <div className="flex items-center gap-2">
          <div>{formatted_date}</div>
          <div className="bg-accent text-xs rounded-lg w-fit px-2 py-1">
            {formatted_time}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const uuid = row.original.uuid;

      const updateUserCallback = async (newUser: UserDetailsEditable) => {
        // First let's update optimistically the user in the table
        // This will make the UI more responsive
        const updated_at = new Date().toLocaleString();
        let editedNewUser: User = {
          ...row.original,
          picture_url: newUser.picture_url,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          birth_date: newUser.birth_date,
          hobbies: newUser.hobbies,
          updated_at: updated_at,
        };
        console.log("new edited user", editedNewUser);
        row.original = editedNewUser;
      };
      return (
        <UpdateUserDialog
          user={uuid as string}
          updateUserCallback={updateUserCallback}
        />
      );
    },
  },
];
