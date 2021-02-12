import { Grid } from "@material-ui/core"
import * as React from "react"
import { request } from "../utils/fetch"

type Gender = "Male" | "Female" | "Other"
type MailListItem = {
  first_name: string
  last_name: string
  age: number
  gender: Gender
}
// const mail: MailListItem[] = [
//     { fullName: 'John Doe', date: 'Oct 22' },
//     { fullName: 'John Doe Jr.', date: 'Oct 22' },
//     { fullName: 'Thomas Jones', date: 'Oct 20' },
// ];

export default function MailList(): JSX.Element {
  // Here we need to call the getMail function, which will eventually hit the necessary endpoint
  // You should probably use React.useEffect to call it during load,
  // and React.useState to set the state
  const [mail, setMail] = React.useState<MailListItem[]>([])

  React.useEffect(() => {
    //Get the mail, and add it to the state
    //This is where the api request is made
    request<MailListItem[]>("/api/profiles/", "get", true, true).then(
      (mailList) => {
        setMail(mailList.parsedBody ? mailList.parsedBody : [])
      }
    )
  })

  return (
    <Grid direction="column" container>
      {mail.map(({ first_name, last_name, age, gender }, index) => {
        const full_name = first_name + last_name
        return (
          <Grid
            container
            direction="row"
            justify="space-between"
            key={full_name + index}
          >
            <div>{full_name}</div>
            <div>{age}</div>
            <div>{gender}</div>
          </Grid>
        )
      })}
    </Grid>
  )
}
