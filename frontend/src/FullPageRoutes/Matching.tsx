import * as React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Card, CardContent, CardActions, Typography, Avatar, Button, Container } from "@material-ui/core";
import { Check, Block, Flag } from '@material-ui/icons';


type MatchCardProps = {
    username: string
}

type MatchingPageProps = {

}

type Match = {
    username: string
}

const useStyles = makeStyles({
    cardRoot: {

    }
})

function MatchCard(props: MatchCardProps) {
    const classes = useStyles()

    return (
        <Card className={classes.cardRoot}>
            <CardContent>
                <Avatar alt='profile image'>P</Avatar>
                <Typography>{props.username}</Typography>
            </CardContent>
            <CardActions>
                <Button><Check/>Accept</Button>
                <Button><Block/>Reject</Button>
                <Button><Flag/>Report</Button>
            </CardActions>
        </Card>
    )
}

export default function MatchingPage(props: MatchingPageProps) {
    const classes = useStyles();
    const [matches, setMatches] = useState<Match[]>([])

    useEffect(() => {
        // TODO request matches and populate matches state
    })

    return (
        <Container>
            <Typography>Matches</Typography>
            {matches.forEach(match => {
                <MatchCard username={match.username}/>
            })}
        </Container>
    )
}
