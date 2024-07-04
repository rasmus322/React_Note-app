import { useQuery } from "@tanstack/react-query"
import { fetchMe } from "../../api/User"
import { Loader } from "../Loader"
import { AuthForm } from "../AuthForm"
import { NoteForm } from "../NoteForm"
import { queryClient } from "../../api/queryClient"
import { LogoutButton } from "../LogoutButton"
import { UserView } from "../UserView"
import { FetchNoteListView } from "../NotesListView/FetchNoteListView"
import "./Account.css"

export const Account = () => {
  const meQuery = useQuery({
    queryFn: () => fetchMe(),
    queryKey: ["users", "me"],
    retry: false
  }, queryClient)

  switch(meQuery.status) {
    case "pending":
      return <Loader/>
    case "error":
      return <AuthForm/>
    case "success":
      return <>
        <div className="header">
          <UserView user={meQuery.data}/>
          <LogoutButton/>
        </div>
        <NoteForm/>
        <FetchNoteListView/>
      </>
  }
}