import {
  EditProfileErrorCodes,
  GenericErrorCodes,
  LoginErrorCodes,
  RegisterErrorCodes,
} from "../types/ErrorCodes";

export const getErrorMessage = (errorCode: string): string | null => {
  switch (errorCode) {
    case GenericErrorCodes.SOMETHING_WENT_WRONG:
      return "Something went wrong.";

    case LoginErrorCodes.INVALID_CREDENTIALS:
      return "Invalid username or password";

    case RegisterErrorCodes.INVALID_EMAIL:
      return "Invalid email.";
    case RegisterErrorCodes.DUPLICATE_EMAIL:
      return "Email already in use.";
    case RegisterErrorCodes.USERNAME_TOO_SHORT:
      return "Username too short (3 characters min).";
    case RegisterErrorCodes.USERNAME_TOO_LONG:
      return "Username too long (32 characters max).";
    case RegisterErrorCodes.DUPLICATE_USERNAME:
      return "Username already in use.";
    case RegisterErrorCodes.PASSWORD_TOO_SHORT:
      return "Password too short (8 characters min).";

    case EditProfileErrorCodes.INVALID_EMAIL:
      return "Invalid email.";
    case EditProfileErrorCodes.DUPLICATE_EMAIL:
      return "Email already in use.";
    case EditProfileErrorCodes.USERNAME_TOO_SHORT:
      return "Username too short (3 characters min).";
    case EditProfileErrorCodes.USERNAME_TOO_LONG:
      return "Username too long (32 characters max).";
    case EditProfileErrorCodes.DUPLICATE_USERNAME:
      return "Username already in use.";
    case EditProfileErrorCodes.PASSWORD_TOO_SHORT:
      return "New password is too short (8 characters min).";
    case EditProfileErrorCodes.INVALID_PASSWORD:
      return "Incorrect current password.";
    case EditProfileErrorCodes.INVALID_USERNAME:
      return "Invalid username.";

    default:
      return null;
  }
};
