"use client";

import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { uploadFiles } from "@/lib/uploadthing";
import { getErrorMessage } from "bloop-utils/validation/getErrorMessage";
import { GenericErrorCodes } from "bloop-utils/types/ErrorCodes";
import { useAuth } from "@/context/AuthContext";

const UploadProfilePic = () => {
  const auth = useAuth();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    async onDrop(accepted, rejected) {
      if (rejected.length > 0) {
        toast.error(rejected[0].errors[0].message);
        return;
      }

      toast.promise(
        uploadFiles("profilePicture", {
          files: accepted,
          input: {
            access_token: localStorage.getItem("access_token") || "",
          },
        }).then(auth.refreshUser),
        {
          loading: "Uploading...",
          success: "Profile picture uploaded successfully",
          error: (_) => {
            return getErrorMessage(GenericErrorCodes.SOMETHING_WENT_WRONG);
          },
        }
      );
    },
    accept: {
      "image/*": [],
    },
  });

  return (
    <div
      className="border-2 border-dashed rounded flex justify-center items-center p-8 text-foreground hover:text-muted-foreground cursor-pointer"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <UploadCloud className="w-16 h-16" />
        <p className="leading-7 font-semibold text-sm">
          {isDragActive ? "Loading..." : "Choose a file or drag and drop"}
        </p>
      </div>
    </div>
  );
};

export default UploadProfilePic;
