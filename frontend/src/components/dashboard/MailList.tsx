import { Grid } from "@material-ui/core"
import * as React from "react"
import { request } from "../../utils/fetch"
import MailItem, { MailListItem } from "./MailItem"

export default function MailList(): JSX.Element {
  const [mail, setMail] = React.useState<MailListItem[]>([])

  React.useEffect(() => {
    request<MailListItem[]>({ path: "/api/profiles/", method: "get" }).then(
      (mailList) => {
        setMail(mailList.parsedBody)
      }
    )
  }, [])

  return (
    <Grid direction="column" container>
      {mail.map((mailListItem, index) => {
        return (
          <Grid item key={index} sm={6}>
            <MailItem {...mailListItem} />
          </Grid>
        )
      })}
    </Grid>
  )
}
