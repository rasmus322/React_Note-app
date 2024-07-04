import "./LoginForm.css";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/User";
import { queryClient } from "../../api/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginScheme = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Длина пароля слишком маленькая")
})

type loginForm = z.infer<typeof loginScheme>

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<loginForm>({
    resolver: zodResolver(loginScheme)
  })

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["users", "me"]})
    }
  }, queryClient)

  return (
    <form className="login-form" onSubmit={handleSubmit(({email, password}) => {
      loginMutation.mutate({email, password})
    })}>
      <FormField label="Email" errorMessage={errors.email?.message}>
        <input type="text" required {...register("email")}/>
      </FormField>
      <FormField label="Пароль" errorMessage={errors.password?.message}>
        <input type="password" required {...register("password")}/>
      </FormField>

      <Button type="submit" isLoading={loginMutation.isPending}>Войти</Button>
    </form>
  );
};
