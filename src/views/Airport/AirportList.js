import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { getAirportDetailsByCode } from "../../services/openSky";

import { AlertBar } from "../../components/Alert";
const useStyles = makeStyles({
  root: {
    maxWidth: 345
  },
  mainTitle: {
    "text-align": "center",
    fontWeight: "bold"
  },
  media: {
    height: 160
  },
  title: {
    "text-align": "center",
    fontWeight: "bold",
    paddingBottom: 0
  },
  actionBtn: {
    "justify-content": "center",
    marginBottom: 12
  },
  airportGrid: {}
});

export default function AirportList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedCity, setCity] = React.useState({
    code: "",
    name: ""
  });

  const [isSnackBarOpened, showSnackBar] = React.useState(false);


  const [selectedCityAirports, setAirports] = React.useState({
    isLoading: false,
    isLoaded: false,
    arrivals: [],
    departure: []
  });

  const airports = [
    {
      name: "Atlanta",
      code: "KATL"
    },
    {
      name: "New York",
      code: "KALB"
    },
    {
      name: "Virginia",
      code: "KCHO"
    },
    {
      name: "New Jersey",
      code: "KEWR"
    },
    {
      name: "Ohio",
      code: "KDAY"
    },
    {
      name: "Alaska",
      code: "PANC"
    },
    {
      name: "Los Angeles",
      code: "KLAX"
    },
    {
      name: "California",
      code: "KACV"
    },
    {
      name: "Houston",
      code: "KIAH"
    }
  ];

  const openCityDialog = selected => {
    setCity({
      code: selected.code,
      name: selected.name
    });
    loadAirportDetail(selected);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadAirportDetail = async airportData => {
    try {
      setAirports({isLoading: true})
      const { arrivals, departure } = await getAirportDetailsByCode({
        airport: airportData.code,
        begin: 1517227200,
        end: 1517230800
      });
      setAirports({arrivals: arrivals, departure: departure, isLoading: false, isLoaded: true})
    } catch (err) {
      console.log(err);
      showSnackBar(true);
      setAirports({...selectedCityAirports, isLoading: false})
    }
  };

  return (
    <div>
      <Card>
        <CardHeader
          color="primary"
          className={classes.mainTitle}
          title="Top Airports by City"
        ></CardHeader>
        <CardContent>
          <Grid container spacing={2}>
            {airports.map(value => (
              <Grid
                key={value.name}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                item
                onClick={() => {
                  openCityDialog(value);
                }}
              >
                <Paper className={classes.paper} />
                <Card className={classes.root}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={require("assets/img/cover.jpeg")}
                      title="Contemplative Reptile"
                    />
                    <CardContent className={classes.title}>
                      <Typography gutterBottom variant="h5" component="h3">
                        {value.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions className={classes.actionBtn}>
                    <Button variant="contained" color="secondary">
                      AIRPORT
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        open={open}
        fullScreen
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {selectedCity.name} Airport
        </DialogTitle>
        <DialogContent>
          <Card>
            <CardHeader
              title="Airport info"
              subheader={"Code: " + selectedCity.code}
            ></CardHeader>

            {selectedCityAirports.isLoading ? (
              <div style={{display: 'flex', flex: 1, justifyContent: 'center'}}>
                <CircularProgress />
              </div>
            ) : (
              <CardContent>
                <div style={{ fontWeight: "bold", marginTop: 10 }}>Arrival</div>
                <div>
                  <List>
                    {selectedCityAirports.arrivals.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={item.callsign} />
                      </ListItem>
                    ))}
                  </List>
                </div>
                <Divider />

                <div style={{ fontWeight: "bold", marginTop: 10 }}>Departure</div>
                <div>
                  <List>
                    {selectedCityAirports.departure.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={item.callsign} />
                      </ListItem>
                    ))}
                  </List>
                </div>
              </CardContent>
            )}
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={isSnackBarOpened} autoHideDuration={2000}>
      
        <AlertBar severity="error">
          Error in loading details Or No Flight Exists
        </AlertBar>
      </Snackbar>
    </div>
  );
}
