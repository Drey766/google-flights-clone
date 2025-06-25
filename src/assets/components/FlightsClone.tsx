// src/components/FlightsClone.tsx
import React, { useState } from 'react';
import type { SearchParams, FlightOffer } from '../types';
import { searchFlights } from '../api/searchFlights';
import { searchAirport } from '../api/searchAirports';
import SearchForm from './SearchForm';
import FlightsList from './FlightsList';
import './FlightsClone.css'; // Assuming you have a CSS file for styling
import svg from '../flights_nc_dark_theme_4.svg'
import { CircularProgress } from '@mui/material';

const FlightsClone: React.FC = () => {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    console.log('Starting flight search with params:', params);
    
    setIsLoading(true);
    setError(null);
    setFlights([]);

    try {
      // Step 1: Get origin and destination airport data
      console.log('Searching for airports...');
      const [originAirport, destinationAirport] = await Promise.all([
        searchAirport(params.origin),
        searchAirport(params.destination),
      ]);

      console.log('Origin airport result:', originAirport);
      console.log('Destination airport result:', destinationAirport);

      // Step 2: Validate both airport results
      if (!originAirport) {
        setError(`Could not find airport information for origin: "${params.origin}". Please try a different city or airport name.`);
        return;
      }

      if (!destinationAirport) {
        setError(`Could not find airport information for destination: "${params.destination}". Please try a different city or airport name.`);
        return;
      }

      // Validate that we have the required IDs
      if (!originAirport.skyId || !originAirport.entityId) {
        setError('Origin airport data is incomplete. Please try a different origin.');
        return;
      }

      if (!destinationAirport.skyId || !destinationAirport.entityId) {
        setError('Destination airport data is incomplete. Please try a different destination.');
        return;
      }

      // Step 3: Perform the flight search
      console.log('Searching for flights...');
      const results = await searchFlights(
        { id: originAirport.skyId, entityId: originAirport.entityId },
        { id: destinationAirport.skyId, entityId: destinationAirport.entityId },
        params.departureDate,
        params.returnDate,
        params.adults || 1,
        params.children || 0,
        params.infants || 0,
        params.travelClass || 'economy'
      );

      console.log('Flight search results:', results);

      if (results.length === 0) {
        setError(`No flights found from ${originAirport.city} to ${destinationAirport.city} on the selected dates. Try different dates or destinations.`);
      } else {
        setFlights(results);
        console.log(`Found ${results.length} flights`);
      }

    } catch (err: any) {
      console.error('Error in flight search process:', err);
      setError('An unexpected error occurred while searching for flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flights-container">
      <div className="fligthscloneImgCont">
        <img src={svg} alt="flights-image" />
        <div className="flights-title">
          <h1 className='flights-h1'>Flights</h1>
        </div>
      </div>
      <SearchForm onSearch={handleSearch} />
      
      {isLoading && (
        <div className="loading-container">
          <CircularProgress />
          <p>Searching for flights...</p>
          <p>This may take a few moments...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <p className='error-message' >{error}</p>
        </div>
      )}
      
      {!isLoading && !error && flights.length === 0 && (
        <div className="no-results">
          <p>Enter your travel details above to search for flights.</p>
        </div>
      )}
      
      {flights.length > 0 && (
        <div className="results-container">
          <h2 className='results-title'>Found {flights.length} flights</h2>
          <FlightsList flights={flights} />
        </div>
      )}
    </div>
  );
};

export default FlightsClone;
