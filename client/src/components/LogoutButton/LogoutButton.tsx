//import { useMutation } from "@tanstack/react-query";
import { Button } from "../Button";
import { logout } from "../../api/User";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../api/queryClient";

export const LogoutButton = () => {
  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    }
  }, queryClient);

  const handleClick = () => {
    logoutMutation.mutate()
  }

  return (
    <div className="logout-button">
      <Button kind="secondary" isLoading={logoutMutation.isPending} onClick={handleClick}>Выйти</Button>
    </div>
  );
};
