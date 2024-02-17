import { useMutation } from "@tanstack/react-query";
import httpClient from "@/lib/httpClient";

export const useAuthCheck = () => {
  return useMutation({
    mutationFn: () => {
      return httpClient.get("/auth/authcheck");
    },
  });
};
