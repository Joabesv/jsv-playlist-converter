import { useQuery } from "@tanstack/vue-query";
import { getUserProfile } from "./spotify.api";

export function useUserProfile(staleTime = 0) {
  return useQuery({
    queryKey: ['fetch-profile'],
    queryFn: getUserProfile,
    staleTime,
  })  
}