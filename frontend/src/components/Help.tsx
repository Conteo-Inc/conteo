import * as React from 'react';
import { TextField, Grid, makeStyles, Button, Typography, Card, CardContent, CardActions, Paper } from '@material-ui/core'


const useStyles= makeStyles({
    root:{
        
        
    },
    topBar:{
        margin: 1,
        padding: 50,
        backgroundColor: "rgb(238,235,228)",

    },
    bottomBar:{
        margin: 2,
        padding: 110,
        backgroundColor: "rgb(234,232,224)",

    }
       
})


export default function Help() {
const classes = useStyles();

    return (
        <>
                <Grid container direction="column">
                <Paper className={classes.topBar}>
                    <Typography variant="h3">Need some help?</Typography>
                    <form>
                        <TextField
                        variant="outlined"
                        label="Ask a question..."
                        placeholder="Ask a question..."
                        />
                    </form>
                </Paper>
                
                
                
                <Paper className={classes.bottomBar}>
                <Grid container justify="center" alignItems="center" spacing={4}>
                    
                    <Grid item>
                        <Card className={classes.root}>
                            <CardContent>
                                <CardActions>
                                <Button href="#FAQs"> FAQs</Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card className={classes.root}>
                            <CardContent>
                                <CardActions>
                                <Button href="#Tutorials"> Tutorials</Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card className={classes.root}>
                            <CardContent>
                                <CardActions>
                                <Button href="#ContactUs"> Support Center</Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                    </Grid>
                                    
                </Grid>
                </Paper>
                </Grid>

            
        </>
    )
}


