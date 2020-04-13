const axios = require("axios").default;

const baseUrl = "https://opensky-network.org/api";
// https://opensky-network.org/api/flights/arrival?airport=PANC&begin=1517227200&end=1517230800

export const getAirportDetailsByCode = flightData => {

  return new Promise((resolve, reject) => {
    axios
      .all([
        getAirportArrivalFlightsDetailsByCode(flightData),
        getAirportDepartureFlightsDetailsByCode(flightData)
      ])
      .then(
        axios.spread(function(arrivals, departure) {
          resolve({
            arrivals: arrivals.data,
            departure: departure.data
          });
        })
      )
      .catch(reject);
  });
};

export const getAirportArrivalFlightsDetailsByCode = (flightData = {}) => {
  return axios.get(`${baseUrl}/flights/arrival`, {
    params: {
      airport: flightData.airport,
      begin: flightData.begin,
      end: flightData.end
    }
  });
};

export const getAirportDepartureFlightsDetailsByCode = (flightData = {}) => {
  return axios.get(`${baseUrl}/flights/departure`, {
    params: {
      airport: flightData.airport,
      begin: flightData.begin,
      end: flightData.end
    }
  });
};
