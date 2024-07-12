import { Button } from "../../../components/ui/button";
import { PlusIcon, ReloadIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { UserCreateValidator, UserValidator, UserView } from "../types";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
interface AddUserProps {
  addNewUserCallback: (
    user: z.infer<typeof UserCreateValidator>
  ) => Promise<boolean>;
}

export default function AddUserDialog({ addNewUserCallback }: AddUserProps) {
  const [hobbies, setHobbies] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
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

  async function onSubmit(values: z.infer<typeof UserCreateValidator>) {
    console.log("form valid");
    setLoading(true);
    if (values.picture_url === "") {
      // Remove the picture_url field if it's empty
      delete values.picture_url;
    }
    console.log(values);
    const sucess = await addNewUserCallback(values);
    setLoading(false);
    if (sucess) {
      console.log("User created successfully");
      const formatted_date = new Date().toLocaleDateString();
      toast({
        title: "User Successfully Created",
        description: `User ${values.first_name} ${values.last_name} created on ${formatted_date}`,
      });
      setHobbies([]);
      form.reset();
    } else {
      setError("Error creating user");
    }
  }

  React.useEffect(() => {
    form.setValue("hobbies", hobbies);
  }, [hobbies]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="h-auto">
          <PlusIcon className="mr-2 h-4 w-4" /> Add new user
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new user</DialogTitle>
          <DialogDescription>
            Fill in the details of the new user
          </DialogDescription>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log(form.getValues());
                console.log(errors);
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
                {error && <div className="text-red-500">{error}</div>}
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
