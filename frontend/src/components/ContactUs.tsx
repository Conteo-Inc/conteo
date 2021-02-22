import * as React from 'react';
import { TextField, Grid, makeStyles, Button, Typography, Card, CardContent, CardActions, Paper } from '@material-ui/core'

type helpBtns={
    href: string,
    value: string,
}

const useStyles= makeStyles({
    root:{
        '& .MuiGrid-root MuiGrid-item':{
            alignItems: "center",
            alignContent: "center",
        },
    },
    topBar:{
        margin: 1,
        padding: 50,
        backgroundColor: "rgb(238,235,228)",
    },
    bottomBar:{
        margin: 2,
        padding: 110,
    },
       
})


export default function Help() {
const classes = useStyles();
const pages: helpBtns[] = [
    {
        href: "ContactUs",
        value: "Contact Us",
    },
    {
        href: "FAQs",
        value: "FAQs",
    },
    {
        href: "Tutorials",
        value: "Tuturials",
    }
];


    return (
        <>
            <Grid container direction="column" alignItems="center" className={classes.topBar}>
                <Grid item justify="center">
                    <Typography variant="h3">Need some help?</Typography>
                    <form>
                        <TextField
                        variant="outlined"
                        label="Ask a question..."
                        placeholder="Ask a question..."
                        />
                    </form>
                </Grid>
               
                <Grid item>
                <Grid container justify="center" alignItems="center" spacing={4} className={classes.bottomBar}>
                    {pages.map(({ href, value }: helpBtns) =>(
                    <Grid key={value} item>
                        <Card>
                            <CardContent>
                                <CardActions>
                                <Button href={href}> {value}</Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
                    
                </Grid>
                </Grid>
            </Grid>

            
        </>
    )
}
