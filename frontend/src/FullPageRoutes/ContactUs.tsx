import * as React from 'react';
import { useState, useEffect} from 'react'
import { TextField, Grid, makeStyles, Paper, Button, Typography } from '@material-ui/core'

const useStyles = makeStyles({
    root:{
        '& .MuiFormControl-root':{
            width: '80%',
            margin: 8,
        },
    },
    pageSideBar:{
        margin: 8,
        padding: 50,
        backgroundColor: "rgb(238,235,228)",
    },
    pageContent:{
        margin: 8,
        padding: 110,
        backgroundColor: "rgb(234,232,224)",
    },
    submitButton:{
        margin: 1,
    },
    cancelButton:{
        margin: 1,
    },
    sideBar:{
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        '@media (min-width:1100px)':{
            fontSize: '1.5rem',
        },
    },

})

const contactValue = {
    name: '',
    email: '',
    message: '',
}

export default function ContactUs() {
    const [values, setValues] = useState(contactValue);
    const classes = useStyles();

    const setContactValue= e =>{
        const {name, value } = e.target
        setValues({
            ... values,
            [name]: value
        })
    }

   return (
        <>
    
        <Grid container>
            <Grid item className={classes.pageSideBar}>
                <Grid container spacing={2} direction="column" justify="center">
                    <Grid item>
                        <Typography className={classes.sideBar}>
                            Report a Video
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.sideBar}>
                            Report an Issue
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.sideBar}>
                            Provide Feedback
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.sideBar}>
                            Report a Profile
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.sideBar}>
                            FAQs
                        </Typography>
                    </Grid>

                </Grid>

            </Grid>



            <Grid item className={classes.pageContent}>
                <form className={classes.root}>
                    <Grid container spacing={2} direction="column" justify="center">
                        <Grid item xs={12}>
                            <TextField
                            variant="outlined"
                            label="Your name"
                            name = "name"
                            value={values.name}
                            onChange={setContactValue}
                            />
                            <TextField
                            variant="outlined"
                            label="Your email"
                            name="email"
                            value={values.email}
                            onChange={setContactValue}
                            />
                            <TextField
                            variant="outlined"
                            label="Type your message here"
                            name="message"
                            multiline
                            rowsMax={6}
                            value={values.message}
                            onChange={setContactValue}
                            />
                            
                        </Grid>
                        <Grid item>
                            <Button
                            variant="contained"
                            color="secondary"
                            className={classes.submitButton}
                            size="large"
                            type="submit"
                            href="#"
                            >
                                Send Report</Button>
                            <Button
                            variant="contained"
                            color="secondary"
                            className={classes.cancelButton}
                            size="large"
                            type="reset"
                            >
                                Cancel</Button>
                        </Grid>
                    </Grid>
                            
                    </form>
                </Grid>
            </Grid>

      
            
        </>
    )
}