import axios from 'axios';

export interface AirportData {
  city: string;
  airportName: string;
  skyId: string;
  entityId: string;
}

export const searchAirport = async (query: string): Promise<AirportData | null> => {
  try {
    const res = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport', {
      params: { 
        query, 
        locale: 'en-US' 
      },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY as string,
        'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
      },
    });

    console.log(`Raw API response for ${query}:`, res.data);

    const data = res.data;

    // Check if response has the expected structure
    if (!data?.status || !Array.isArray(data.data)) {
      console.error('Invalid data format from API', data);
      return null;
    }

    const suggestions = data.data;
    console.log(`Airport suggestions for ${query}:`, suggestions);

    // Find the best match - prefer AIRPORT over CITY
    const airport = suggestions.find(
      (s: any) => s.navigation?.relevantFlightParams?.skyId && 
                  s.navigation?.relevantFlightParams?.entityId &&
                  s.navigation?.relevantFlightParams?.flightPlaceType === 'AIRPORT'
    ) || suggestions.find(
      (s: any) => s.navigation?.relevantFlightParams?.skyId && 
                  s.navigation?.relevantFlightParams?.entityId &&
                  s.navigation?.relevantFlightParams?.flightPlaceType === 'CITY'
    );

    if (!airport) {
      console.warn('No valid airport or city suggestion found for:', query);
      return null;
    }

    console.log(`Selected airport for ${query}:`, airport);

    return {
      city: airport.presentation?.title || '',
      airportName: airport.presentation?.suggestionTitle || airport.presentation?.title || '',
      skyId: airport.navigation?.relevantFlightParams?.skyId || '',
      entityId: airport.navigation?.relevantFlightParams?.entityId || '',
    };
  } catch (error: any) {
    console.error('Error searching airport:', error.response?.data || error.message);
    return null;
  }
};
