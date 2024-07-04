import { z } from "zod"
import { validateResponse } from "./validateResponse"

export const UserScheme = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string()
})

export type User = z.infer<typeof UserScheme>

export function fetchUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`).then((response) => response.json()).then(data => UserScheme.parse(data))
}

export const registerUser = ({username, email, password}: { username: string, email: string, password: string }): Promise<void> => {
  return fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({username, email, password})
  }).then(() => undefined)
}

export const login = ({email, password}: { email: string, password: string }): Promise<void> => {
  return fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email, password})
  }).then(validateResponse).then(() => undefined)
}

export function logout(): Promise<void> {
  return fetch("/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(validateResponse).then(() => undefined)
}

export function fetchMe(): Promise<User> {
  return fetch("api/users/me").then(validateResponse).then(response => response.json()).then(data => UserScheme.parse(data))
}