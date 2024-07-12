import { literal, z } from "zod";

export type User = {
  uuid: string;
  picture_url?: string;
  email: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  hobbies: string[];
  created_at: string;
  updated_at: string;
};

export type UserDetailsEditable = {
  picture_url?: string | undefined;
  email: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  hobbies: string[];
};

export const UserValidator = z.object({
  uuid: z.string().uuid(),
  picture_url: z.string().url().optional().nullable(),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  birth_date: z.string().date(),
  hobbies: z
    .array(z.string().min(1))
    .refine((items) => new Set(items).size === items.length, {
      message: "Must be an array of unique strings",
    }),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export const UserCreateValidator = UserValidator.omit({
  uuid: true,
  created_at: true,
  updated_at: true,
}).extend({
  picture_url: z.string().url().or(literal("")).optional(),
  hobbies: z.array(z.string().min(1)).default([]),
});

export type UserView = {
  picture_url: string;
  email: string;
  full_name: string;
  hobbies: string[];
  updated_at: string;
};
export type UserListApiDetails = {
  totalDBRowCount: number;
  users: User[];
  lastCursor: string;
  hasMore: boolean;
};
export type UserApiDetails = {
  success: boolean;
  user?: UserDetailsEditable;
};
export type UserPostApiDetails = {
  success: boolean;
  user?: UserView;
};
