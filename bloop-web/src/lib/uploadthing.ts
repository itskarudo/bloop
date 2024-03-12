import { generateReactHelpers } from "@uploadthing/react";

import type { BloopFileRouter } from "bloop-utils/types";

export const { uploadFiles } = generateReactHelpers<BloopFileRouter>({
  url: process.env.NEXT_PUBLIC_API_URL + "/upload",
});
