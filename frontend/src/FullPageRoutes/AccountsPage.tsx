import * as React from 'react';
import { Grid, makeStyles, Button, Typography, TextField, InputAdornment, IconButton, Divider, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, FormHelperText, Dialog, DialogContent, DialogActions} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useState, useEffect } from 'react'

export type userAccounts={
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    email: string,
    successor: string,
}

const AccountValue = {
    firstName:'',
    lastName: '',
    username: '',
    password: '',
    email: '',
    successor: '',
}


const useStyles = makeStyles({
    root:{
        '& .MuiFormControl-root':{
            width: '100%',
            margin: 8,
        },
    },
    topBar: {
        margin: 1,
        padding: 50,
        backgroundColor: "rgb(238,235,228)",
    },
    pageContent: {
        margin: 8,
        padding: 110,
    },
    button:{
        margin: 5,
    },
})


export default function AccountsPage(): JSX.Element {
    const classes = useStyles();
    const [editMode, editModeOn] = useState(false);
    const [value, setValues] = useState('');
    const [btnText, setBtnText] = useState('Delete or Deactivate Account')
    const [open, setOpen] = useState(false)
    const [accounts, setAccounts] = useState( )
    
       

    const handleChange = () => {

    }
    
    const handleEdit = () => {
        editModeOn(true)
        
    }

    const handleSave = () => {

    }

    const handleCancel = () => {
        editModeOn(false)
    }

    const handleDeleteChanges = (event: any) =>{
        setValues(event.target.value);
        
        
        
    }

    const handleAccountChanges = (event: any) => {
        event.preventDefault();

        if (value === 'Deactivating Account'){
            setBtnText('Deactivate Account');
            setOpen(true);

        } else if (value === 'Delete Account'){
            setBtnText('Delete Account');
            setOpen(true)
        }
        else{
            setBtnText('Delete or Deactivate Account')
            setOpen(false);
        }
    }

    
    const handleClose = () =>{
        setOpen(false);
    }

    useEffect(()=>{
        React.request({ path: "/api/profile", method: "get" })
        .then((response)=>{
            const account: UserAccounts = response.parsedBody
            const content: AccountValue = {
                firstName: account.firstName,
                lastName: account.lastName,
                username: account.username,
                password: account.password,
                email: account.email,
                successor: account.password,
            }
            setAccounts(content)
        })}, [accounts]
        );


    return (
        <>
            <Grid container direction="column" alignItems="center" className={classes.topBar}>
                <Grid item justify="center">
                <Typography variant="h4">Accounts Settings</Typography>
                </Grid>
                <Grid item>
                <form className={classes.root} onSubmit={handleSave}>
                <Grid container className={classes.pageContent} spacing={5}>
                    <Grid item xs={6}>
                    <TextField
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    defaultValue="Jane"
                    InputProps={{
                        readOnly: true,
                    }}
                    />

                    <TextField
                    name="username"
                    label="Username"
                    variant="outlined"
                    defaultValue="Jane"
                    InputProps={{
                        readOnly: true,
                    }}
                    />

                    <TextField
                    name="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    defaultValue = "janed1@email.com"
                    onChange={handleChange}
                    InputProps={{
                        endAdornment:(
                            <InputAdornment position="end">
                                <IconButton onClick={handleEdit}>
                                    <EditIcon/>
                                </IconButton>
                            </InputAdornment>
                        ),
                       
                    }}
                    />
                    </Grid>

                    <Grid item xs={6}>             
                    <TextField
                    name="lastName"
                    label="Last Name"
                    variant="outlined"
                    defaultValue="Doe"
                    InputProps={{
                        readOnly: true,
                    }}
                    />                    
                    
                    <TextField
                    name="password"
                    label="Password"
                    type="password"
                    defaultValue = "Hello"
                    autoComplete="current-password"
                    variant="outlined"
                    onChange={handleChange}
                    InputProps={{
                        endAdornment:(
                            <InputAdornment position="end">
                                <IconButton onClick={handleEdit}>
                                    <EditIcon/>
                                </IconButton>
                            </InputAdornment>
                        ),
                       
                    }}
                    />

                    <TextField
                    name="sucessor"
                    label="Account Successor"
                    variant="outlined"
                    defaultValue = "John Doe"
                    onChange={handleChange}
                    InputProps={{
                        endAdornment:(
                            <InputAdornment position="end">
                                <IconButton onClick={handleEdit}>
                                    <EditIcon/>
                                </IconButton>
                            </InputAdornment>
                        ),
                        
                    }}
                    />
                    </Grid>
                    
                    <Grid item>
                        <Button variant="contained" className={classes.button} type="submit">Save</Button>
                        <Button variant="contained" className={classes.button} onClick={handleCancel}>Cancel</Button>
                    </Grid>
                </Grid>
                <Divider/>
                </form>
                </Grid>
                <Grid item justify="center">
                <Typography variant="h5">Deactivate or Delete Account</Typography>
                </Grid>
                <Grid item>
                <form onSubmit={handleAccountChanges}>
                    <Grid container>
                    <Grid item></Grid>
                    <FormControl>
                        <RadioGroup name="accountDelete" value={value} onChange={handleDeleteChanges}>
                            <FormControlLabel value="Deactivating Account" control={<Radio />} label="Deactivate Account" />
                            <FormHelperText>Your account would be temporarily disabled.</FormHelperText>
                            <FormControlLabel value="Delete Account" control={<Radio />} label="Delete Account" />
                            <FormHelperText>Your account would be deleted permanently.</FormHelperText>
                        </RadioGroup>
                    </FormControl>
                    </Grid>
                    <Grid item>
                    <Button type="submit" variant="contained" className={classes.button} onClick={handleAccountChanges}>{btnText}</Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogContent>
                            Are you sure you to {btnText}?
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Yes</Button>
                            <Button onClick={handleClose}>No</Button>
                        </DialogActions>
                    </Dialog>
                    </Grid>

                </form>
                </Grid>
                </Grid>
           
        </>
    )
}