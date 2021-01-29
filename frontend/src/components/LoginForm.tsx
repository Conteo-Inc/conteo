import * as React from 'react';
import { Avatar, Paper, Grid, TextField, FormControlLabel, Checkbox, Button, Typography, Link } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import  LockOutlinedIcon  from '@material-ui/icons/LockOutlined';
import { red } from '@material-ui/core/colors';

export type UserHandlerArgs = {
    e: React.FormEvent<HTMLFormElement>;
    errorMessage: string | null
    username: string | null;
    password: string | null;
};
type LoginFormProps = {
    handle_login: ({ e, username, password }: UserHandlerArgs) => void;
    errorMessage: string | null;
};

export const useStyles = makeStyles({
    paperStyle : {
        padding: 20,
        height: '70vh',
        width: 280,
        margin: "20px auto"
    },
    avatarStyle : {
        backgroundColor: red[500],
    },
    btnstyle : {
        margin: '8px 0',
    }
});

export const ColorButton = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(red[500]),
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[700],
      },
    },
  }))(Button);

export default function LoginForm({ handle_login, errorMessage }: LoginFormProps) {
    const [username, setUsername] = React.useState<string>(null);
    const [password, setPassword] = React.useState<string>(null);

    const classes = useStyles();

    // Clear Error message
    React.useEffect(() => {
        errorMessage = ""
    });

    return (
        <Grid>
            <Paper elevation={10} className={classes.paperStyle}>
            <Grid 
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            >
                <Avatar className={classes.avatarStyle}><LockOutlinedIcon/></Avatar>
                <h2>Log In </h2>
            </Grid>
            <form onSubmit={(e) => handle_login({ e, errorMessage, username, password })}>
                <TextField 
                label="Email"
                placeholder="Enter email"
                onChange={(e) => setUsername(e.target.value)}
                type='email' 
                value={username || ""} 
                fullWidth 
                required/>
                <TextField 
                label="Password"
                type="password"
                placeholder="Enter password" 
                value={password || ""}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth 
                required/>
                <FormControlLabel
                    control={
                    <Checkbox
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Stay Signed in"
                />
                <ColorButton type='submit' variant='contained' fullWidth className={classes.btnstyle} >Sign In</ColorButton>
                <Typography>
                    <Link href="#">
                        Forgot password
                    </Link>
                </Typography>
                <br/>
                <span>{errorMessage}</span> 
                <br/>
            </form>

            </Paper>
        </Grid>
    );
}
