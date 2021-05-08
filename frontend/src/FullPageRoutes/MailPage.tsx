import * as React from "react"
import { Grid } from "@material-ui/core"
import MailItem, { MailListItem } from "../components/MailItem"
import { request } from "../utils/fetch"

export default function MailPage(): JSX.Element {
  const [mail, setMail] = React.useState<MailListItem[]>([])
  const [undecided, setUndecided] = React.useState<MailListItem[]>([])

  React.useEffect(() => {
    request<{ penpals: MailListItem[]; undecided: MailListItem[] }>({
      path: "/api/mail/",
      method: "get",
    }).then((mailList) => {
      setMail(mailList.parsedBody.penpals)
      setUndecided(mailList.parsedBody.undecided)
    })
  }, [])

  const removePenpal = (id: number) => {
    request({
      path: "/api/matches/",
      method: "put",
      body: { matchId: id, response: false },
    })
      .then(() => {
        setMail((oldMail) => {
          const copy = oldMail.slice()
          const idx = copy.findIndex((v) => v.id === id)
          copy.splice(idx, 1)
          return copy
        })
      })
      .catch((err) => console.error("Failed to remove penpal:", err))
  }

  return (
    <Grid direction="column" container>
      {mail.map((mailListItem, index) => {
        return (
          <Grid item key={index} sm={6}>
            <MailItem {...mailListItem} removePenpal={removePenpal} isDecided />
          </Grid>
        )
      })}
      {undecided.map((mailListItem, index) => {
        return (
          <Grid item key={index} sm={6}>
            <MailItem {...mailListItem} removePenpal={removePenpal} />
          </Grid>
        )
      })}
    </Grid>
  )
}
