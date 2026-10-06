import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/use-auth";
import { getStudyProfileServerFn } from "@/lib/profile/study-profile.server";

export function usePlan() {
  const { usuario, carregando } = useAuth();
  const query = useQuery({
    queryKey: ["subscription", usuario?.id ?? "guest"],
    queryFn: () => getStudyProfileServerFn(),
    enabled: Boolean(usuario),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
  return {
    hasPlus: Boolean(usuario && !query.isError && query.data?.profile?.plan === "plus"),
    loading: carregando || Boolean(usuario && query.isPending),
  };
}
