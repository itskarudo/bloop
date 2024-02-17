import { z } from "zod";
import {
  EditProfileErrorCodes,
  GenericErrorCodes,
  ListsErrorCodes,
  LoginErrorCodes,
  RegisterErrorCodes,
} from "../types/ErrorCodes";

export const registerSchema = z.object({
  username: z
    .string({
      required_error: RegisterErrorCodes.USERNAME_TOO_SHORT,
    })
    .regex(/^[a-zA-Z0-9_]+$/, RegisterErrorCodes.INVALID_USERNAME)
    .min(3, RegisterErrorCodes.USERNAME_TOO_SHORT)
    .max(32, RegisterErrorCodes.USERNAME_TOO_LONG),
  email: z
    .string({
      required_error: RegisterErrorCodes.INVALID_EMAIL,
    })
    .email(RegisterErrorCodes.INVALID_EMAIL),
  password: z
    .string({
      required_error: RegisterErrorCodes.PASSWORD_TOO_SHORT,
    })
    .min(8, RegisterErrorCodes.PASSWORD_TOO_SHORT),
});

export const loginSchema = z.object({
  username: z
    .string({
      required_error: LoginErrorCodes.INVALID_CREDENTIALS,
    })
    .min(3, LoginErrorCodes.INVALID_CREDENTIALS)
    .max(32, LoginErrorCodes.INVALID_CREDENTIALS),
  password: z
    .string({
      required_error: LoginErrorCodes.INVALID_CREDENTIALS,
    })
    .min(8, LoginErrorCodes.INVALID_CREDENTIALS),
});

export const listsSchema = z.object({
  title: z
    .string({
      required_error: ListsErrorCodes.TITLE_NOT_FOUND,
    })
    .max(32, ListsErrorCodes.TITLE_TOO_LONG),
  invites: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    })
  ),
});

export const addMediaSchema = z.object({
  mediaList: z.array(
    z.object({
      id: z.number({ required_error: ListsErrorCodes.INVALID_MEDIA }),
      title: z.string({ required_error: ListsErrorCodes.INVALID_MEDIA }),
      releaseDate: z.string({ required_error: ListsErrorCodes.INVALID_MEDIA }),
      type: z.enum(["movie", "tv-show", "anime"], {
        required_error: ListsErrorCodes.INVALID_MEDIA,
      }),
      image: z.string().nullable(),
    })
  ),
});

export const renameListSchema = z.object({
  title: z
    .string({ required_error: ListsErrorCodes.TITLE_NOT_FOUND })
    .max(32, ListsErrorCodes.TITLE_TOO_LONG),
});

export const inviteUsersSchema = z.object({
  usernames: z.array(z.string(), {
    required_error: ListsErrorCodes.USERNAMES_NOT_FOUND,
  }),
});

export const toggleWatchedSchema = z.object({
  season: z.number({
    required_error: GenericErrorCodes.SOMETHING_WENT_WRONG,
  }),
  episode: z.number({
    required_error: GenericErrorCodes.SOMETHING_WENT_WRONG,
  }),
});

export const editProfileSchema = z
  .object({
    username: z
      .string({
        required_error: EditProfileErrorCodes.USERNAME_TOO_SHORT,
      })
      .regex(/^[a-zA-Z0-9_]+$/, EditProfileErrorCodes.INVALID_USERNAME)
      .min(3, EditProfileErrorCodes.USERNAME_TOO_SHORT)
      .max(32, EditProfileErrorCodes.USERNAME_TOO_LONG)
      .or(z.literal("")),
    email: z
      .string({
        required_error: EditProfileErrorCodes.INVALID_EMAIL,
      })
      .email(EditProfileErrorCodes.INVALID_EMAIL)
      .or(z.literal("")),
    currentPassword: z
      .string()
      .min(8, EditProfileErrorCodes.INVALID_PASSWORD)
      .or(z.literal("")),
    newPassword: z
      .string()
      .min(8, EditProfileErrorCodes.PASSWORD_TOO_SHORT)
      .or(z.literal("")),
  })
  .refine((data) => !data.currentPassword || data.newPassword, {
    path: ["newPassword"],
    message: EditProfileErrorCodes.PASSWORD_TOO_SHORT,
  })
  .refine((data) => data.currentPassword || !data.newPassword, {
    path: ["currentPassword"],
    message: EditProfileErrorCodes.INVALID_PASSWORD,
  });
