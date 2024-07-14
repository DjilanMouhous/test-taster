import { Button } from "../../../components/ui/button";
import {
  Pencil1Icon,
  PlusIcon,
  ReloadIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  UserCreateValidator,
  UserDetailsEditable,
  UserValidator,
  UserView,
} from "../types";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { InputTags } from "../../../components/ui/input-tags";
import React from "react";
import { toast } from "../../../components/ui/use-toast";
import { getUserDetails } from "../../../services/TasterAPI/UsersAPI/GetUserDetails";
import { updateUser } from "../../../services/TasterAPI/UsersAPI/UpdateUser";
interface UpdateUserProps {
  user: string;
  updateUserCallback: (user: z.infer<typeof UserCreateValidator>) => void;
}

export default function UpdateUserDialog({
  user,
  updateUserCallback,
}: UpdateUserProps) {
  const [hobbies, setHobbies] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [initalDataReady, setInitalDataReady] = React.useState<boolean>(false);
  const [isPopinOpen, setIsPopinOpen] = React.useState<boolean>(false);
  const [initalUser, setInitalUser] =
    React.useState<UserDetailsEditable | null>(null);
  const form = useForm<z.infer<typeof UserCreateValidator>>({
    resolver: zodResolver(UserCreateValidator),
    defaultValues: {
      picture_url: "",
      email: "",
      first_name: "",
      last_name: "",
      birth_date: "",
      hobbies: [],
    },
  });
  React.useEffect(() => {
    if (!isPopinOpen) return;
    getUserDetails(user).then((response) => {
      const user = response.user;
      if (!user) {
        console.error("User not found");
        return;
      }
      setInitalUser(user);
      setInitalDataReady(true);
    });
  }, [isPopinOpen]);

  React.useEffect(() => {
    if (!initalDataReady || !initalUser) return;
    form.setValue("picture_url", initalUser.picture_url ?? "");
    form.setValue("email", initalUser.email);
    form.setValue("first_name", initalUser.first_name);
    form.setValue("last_name", initalUser.last_name);
    form.setValue("birth_date", initalUser.birth_date);
    form.setValue("hobbies", initalUser.hobbies);
    setHobbies(initalUser.hobbies);
  }, [initalDataReady]);

  async function onSubmit(values: z.infer<typeof UserCreateValidator>) {
    updateUserCallback(values);
    setLoading(true);
    if (values.picture_url === "") {
      // Remove the picture_url field if it's empty
      delete values.picture_url;
    }
    const sucess = await updateUser({ user: values, uuid: user });
    setLoading(false);
    if (sucess) {
      const formatted_date = new Date().toLocaleDateString();
      toast({
        title: "User Successfully Created",
        description: `User ${values.first_name} ${values.last_name} created on ${formatted_date}`,
      });
    } else {
      if (initalUser) {
        updateUserCallback(initalUser);
      }
    }
  }

  React.useEffect(() => {
    form.setValue("hobbies", hobbies);
  }, [hobbies]);

  return (
    <Dialog onOpenChange={(open) => setIsPopinOpen(open)}>
      <DialogTrigger>
        <Button className="h-auto px-2 ">
          <Pencil1Icon className=" h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!initalDataReady && (
          // Show a spinner while loading the data
          <div className="h-full bg-white w-full absolute top-0 left-0 z-10 rounded-lg grid place-items-center ">
            <ReloadIcon className="animate-spin h-8 w-8 " />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Update user</DialogTitle>
          <DialogDescription>Update the user details below</DialogDescription>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error(errors);
              })}
              className=" space-y-6 mt-8"
            >
              <div className="fields_wrapper space-y-3 ">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hobbies</FormLabel>
                      <FormControl>
                        <>
                          <InputTags
                            value={hobbies}
                            onChange={setHobbies}
                            placeholder="Enter values, comma separated..."
                            className="max-w-[500px]"
                          />
                        </>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="picture_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Picture URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/picture.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button className="" type="submit">
                  Submit
                </Button>
                {loading && (
                  <div className=" spinner">
                    <UpdateIcon className="animate-spin h-4 w-4 " />
                  </div>
                )}
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
