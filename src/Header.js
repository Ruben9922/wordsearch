import React from 'react';
import {AppBar, IconButton, makeStyles, Toolbar, Tooltip, Typography} from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Wordsearch Generator
        </Typography>
        <Tooltip title="GitHub repository">
          <IconButton aria-label="GitHub" href="https://github.com/Ruben9922/wordsearch" color="inherit">
            <GitHubIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
