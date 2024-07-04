import { FormField } from "../FormField";
import { Button } from "../Button";
import "./NoteForm.css";
import {z} from 'zod';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from "@tanstack/react-query";
import { createNote } from "../../api/Note";
import { queryClient } from "../../api/queryClient";

const CreateNoteScheme = z.object({
  title: z.string(),
  text: z.string().min(10, "Длина текста должна быть не менее 10 символов"),
})

type CreateNoteForm = z.infer<typeof CreateNoteScheme>

export const NoteForm = () => {
  const { register, reset, handleSubmit, formState: { errors } } = useForm<CreateNoteForm>({
    resolver: zodResolver(CreateNoteScheme)
  })


  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ["notes"]})
    }
  }, queryClient)

  return (
    <form className="note-form" onSubmit={handleSubmit(({ title, text }) => {
      reset()
      createNoteMutation.mutate({title, text})
    })}>
      <FormField label="Заголовок">
        <input type="text" {...register("title")}/>
      </FormField>
      <FormField label="Текст" errorMessage={errors.text?.message}>
        <textarea 
          {...register("text")}
        />
      </FormField>
      <Button type="submit" isLoading={createNoteMutation.isPending}>Сохранить</Button>
    </form>
  );
};
