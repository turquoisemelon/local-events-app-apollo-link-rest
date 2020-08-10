import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import './App.css';

const SONGKICK_API_KEY = process.env.REACT_APP_SONGKICK_ACCESS_TOKEN;

type AppProps = {
  query?: String;
}

const metroAreas = {
  Toronto: {
    latitude: 43.651070,
    longitude: -79.347015,
  }
}

const TORONTO = "Toronto";
const CANADA = "Canada";

const GET_EVENTS_BY_METRO_AREA = gql`
query getMetroAreaID($lat: Float!, $lng: Float!, $apiKey: String!) {
  eventsPerArea(lat: $lat, lng: $lng, apiKey: "${SONGKICK_API_KEY}") @rest(type: "EventsPerArea", path: "search/locations.json?location=geo%3A{args.lat}%2C{args.lng}&apikey={args.apiKey}") {
    location {
      metroArea {
        id @export(as: "id")
        displayName
        country
        lng
        lat
        events (apiKey: "${SONGKICK_API_KEY}") @rest(type: "Events", path: "metro_areas/{exportVariables.id}/calendar.json?apikey={args.apiKey}") {
          event
        }
      }
    }
  }
}
`;



const App: React.FC<AppProps> = ({ query = TORONTO }) => {
  const [metroAreaCoordinates, setMetroAreaCoordinates] = useState({
    latitude: metroAreas.Toronto.latitude,
    longitude: metroAreas.Toronto.longitude,
  });

  const [metroAreaId, setMetroAreaId] = useState(null);


  const { loading, error, data } = useQuery(GET_EVENTS_BY_METRO_AREA, {
    variables: { lat: metroAreaCoordinates.latitude, lng: metroAreaCoordinates.longitude }
  });

  console.log('data graphql', data)
  const renderedData = data && data.eventsPerArea.location && data.eventsPerArea.location.filter((item: any) => item.metroArea.displayName === TORONTO && item.metroArea.country.displayName === CANADA)
  console.log('renderedData', renderedData)
  return (
    <div className="App">
      {renderedData ? renderedData[0].metroArea.events.event.map((event: any) => (<li key={event.id}>{event.displayName}</li>)) : null}
    </div>
  );
}

export default App;
