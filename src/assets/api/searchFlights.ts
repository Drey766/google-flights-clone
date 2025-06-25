import axios from 'axios';
import type { FlightOffer } from '../types';

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string;

export const searchFlights = async (
  origin: { id: string; entityId: string },
  destination: { id: string; entityId: string },
  date: string,
  returnDate?: string,
  adults: number = 1,
  children: number = 0,
  infants: number = 0,
  travelClass: string = 'economy'
): Promise<FlightOffer[]> => {
  try {
    console.log('Flight search params:', {
      origin,
      destination,
      date,
      returnDate,
      adults,
      children,
      infants,
      travelClass
    });

    // Build params object according to API documentation
    const params: any = {
      originSkyId: origin.id,
      destinationSkyId: destination.id,
      originEntityId: origin.entityId,
      destinationEntityId: destination.entityId,
      date,
      cabinClass: travelClass,
      adults: adults.toString(), // Convert to string as per API docs
      sortBy: 'best',
      currency: 'USD',
      market: 'en-US',
      countryCode: 'US'
    };

    // Only add optional parameters if they have values
    if (returnDate && returnDate.trim() !== '') {
      params.returnDate = returnDate;
    }
    
    if (children > 0) {
      params.children = children.toString();
    }
    
    if (infants > 0) {
      params.infants = infants.toString();
    }

    console.log('Final API params:', params);

    // Use axios.request instead of axios.get to match the documentation exactly
    const options = {
      method: 'GET' as const,
      url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights',
      params,
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    console.log('Flight search API response:', response.data);

    // Handle the response structure
    if (!response.data) {
      console.error('No data received from flight search API');
      return [];
    }

    // Check for different possible response structures
    let itineraries = response.data.data?.itineraries || 
                     response.data.itineraries || 
                     response.data.data?.flights || 
                     response.data.flights ||
                     [];

    console.log('Extracted itineraries:', itineraries);
    
    if (!Array.isArray(itineraries)) {
      console.log('Itineraries is not an array, full response:', response.data);
      return [];
    }

    return itineraries;

  } catch (err: any) {
    console.error('Flight search failed:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      config: err.config
    });
    return [];
  }
};
