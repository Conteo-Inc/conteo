import * as React from "react"

export type DashboardProps = {
  email: string | null
  handle_logout: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}

export default function Dashboard({ email, handle_logout }: DashboardProps) {
  return (
    <>
      <h1>Hello {email}</h1>
      <ul>
        <li onClick={handle_logout}>Logout</li>
      </ul>
    </>
  )
}
