import { FormField } from "../FormField";
import { Button } from "../Button";
import "./RegisterForm.css";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/User";
import { queryClient } from "../../api/queryClient";
import { z } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerScheme = z.object({
  username: z.string().min(5, "Длина имени слишком маленькая"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Длина пароля слишком маленькая")
})

type registerForm = z.infer<typeof registerScheme>

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<registerForm>({
    resolver: zodResolver(registerScheme)
  })

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['users', 'me']})
    },
  }, queryClient)

  return (
    <form className="register-form" onSubmit={handleSubmit(({ username, email, password }) => {
      registerMutation.mutate({username, email, password})
    })}>
      <FormField label="Имя" errorMessage={errors.username?.message}>
        <input type="text" required {...register("username")}/>
      </FormField>
      <FormField label="Email" errorMessage={errors.email?.message}>
        <input type="text" required {...register("email")}/>
      </FormField>
      <FormField label="Пароль" errorMessage={errors.password?.message}>
        <input type="password" required {...register("password")}/>
      </FormField>

      <Button type="submit" isLoading={registerMutation.isPending}>Зарегистрироваться</Button>
    </form>
  );
};
