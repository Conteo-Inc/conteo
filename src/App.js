import React from 'react';
import './App.css';
import { makeStyles } from "@material-ui/core/styles";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Container } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import Person from "@material-ui/icons/Person";
import ListAlt from "@material-ui/icons/ListAlt";
import Mail from "@material-ui/icons/Mail";
import Info from "@material-ui/icons/Info";
import Help from "@material-ui/icons/Help";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {width: 'inherit'}
}))

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <Router>
        <div style={{display: 'flex'}}>
            <Drawer
                style={{width: '240px'}}
                variant="persistent"
                anchor="left"
                open={true}
                classes={{paper: classes.drawerPaper}}>


          <List>
            <Link to="/" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItem>
            </Link>
            <Link to="/profile" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary={"My Profile"} />
              </ListItem>
            </Link>
            <Link to="/penpal" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary={"Penpal List"} />
              </ListItem>
            </Link>
            <Link to="/mail" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary={"Penpal Mail"} />
              </ListItem>
            </Link>
            <Link to="/faqs" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <Info />
                </ListItemIcon>
                <ListItemText primary={"FAQs"} />
              </ListItem>
            </Link>
            <Link to="/help" className={classes.link}>
              <ListItem button>
                <ListItemIcon>
                  <Help />
                </ListItemIcon>
                <ListItemText primary={"Tutorials"} />
              </ListItem>
            </Link>
            
          </List>
            </Drawer>
            <Switch>
              <Route exact path="/">
                <Container>
                  <Typography variant="h3" gutterBottom>
                      Welcome to CONTEO!!
                  </Typography>
                </Container>
              </Route>
              <Route exact path="/profile">
                <Container>
                  <Typography variant="h3" gutterBottom>
                      My Profile
                  </Typography>
                </Container>
              </Route>
              <Route exact path="/penpal">
                <Container>
                  <Typography variant="h3" gutterBottom>
                     Penpal List
                  </Typography>
                </Container>
              </Route>
              <Route exact path="/mail">
                <Container>
                  <Typography variant="h3" gutterBottom>
                      Penpal Mail
                  </Typography>
                </Container>
              </Route>
              <Route exact path="/faqs">
                <Container>
                  <Typography variant="h3" gutterBottom>
                      FAQs
                  </Typography>
                </Container>
              </Route>
              <Route exact path="/help">
                <Container>
                  <Typography variant="h3" gutterBottom>
                      Tutorials
                  </Typography>
                </Container>
              </Route>
            </Switch>


            </div>
      </Router>
      
    </div>
  );
}

export default App;
