import { Grid } from "@material-ui/core"
import * as React from "react"
import { request } from "../../utils/fetch"
import MailItem, { MailListItem } from "./MailItem"

const dummyMail: MailListItem[] = [
  { first_name: "Michael", last_name: "Needleman", age: 1000, gender: "Male" },
  { first_name: "Michael", last_name: "Needleman", age: 1000, gender: "Male" },
  { first_name: "Michael", last_name: "Needleman", age: 1000, gender: "Male" },
  { first_name: "Michael", last_name: "Needleman", age: 1000, gender: "Male" },
  { first_name: "Michael", last_name: "Needleman", age: 1000, gender: "Male" },
]

export default function MailList(): JSX.Element {
  // Here we need to call the getMail function, which will eventually hit the necessary endpoint
  // You should probably use React.useEffect to call it during load,
  // and React.useState to set the state
  const [mail, setMail] = React.useState<MailListItem[]>([])

  React.useEffect(() => {
    //Get the mail, and add it to the state
    //This is where the api request is made
    request<MailListItem[]>("/api/profiles/", "get", true).then(() => {
      // setMail(mailList.parsedBody ? mailList.parsedBody : []);
      setMail(dummyMail)
    })
  }, [])

  return (
    <Grid direction="column" container>
      {mail.map((mailListItem, index) => {
        return (
          <Grid item key={index} md={10}>
            <MailItem {...mailListItem} />
          </Grid>
        )
      })}
    </Grid>
  )
}
