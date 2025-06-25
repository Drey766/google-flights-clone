export interface MarketingCarrier {
  alternateId: string;
  id: number;
  logoUrl: string;
  name: string;
}

export interface FlightOffer {
  id: string;
  price: {
    formatted: string;
    raw: number;
  };
  farePolicy?: {
    isChangeAllowed: boolean;
    isCancellationAllowed: boolean;
    isPartiallyChangeable: boolean;
    isPartiallyRefundable: boolean;
  };
  score?: number;
  legs: {
    id: string;
    origin: {
      iataCode: string;
      displayCode: string;
      city: string;
    };
    destination: {
      iataCode: string;
      displayCode: string;
      city: string;
    };
    carriers: {
      marketing: MarketingCarrier[];
      operationType: string;
    };
    departure: string;
    arrival: string;
    duration: number; // in minutes
    carrierCode: string;
    flightNumber: string;
    durationInMinutes: number;
    stopCount: number;
    segments: {
      departure: string;
      arrival: string;
      carrierCode: string;
      flightNumber: string;
      durationInMinutes: number; // in minutes
      id: string;
      stopCount: number;
      marketingCarrier?: {
        allianceId: number;
        alternateId: string;
        id: number;
        displayCode: string;
        name: string;
      };
      operatingCarrier?: {
        allianceId: number;
        alternateId: string;
        id: number;
        displayCode: string;
        name: string;
      };
      destination: {
        country: string;
        displayCode: string;
        flightPlaceId: string;
        name: string;
      };
      origin: {
        country: string;
        displayCode: string;
        flightPlaceId: string;
        name: string;
      };
  }[];
    aircraft?: {
      code: string;
      name?: string;
    };
  }[];
  itineraries: {
    duration: string;
    segments: {
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
    }[];
  }[];
  validatingAirlineCodes: string[];
}

export interface AirportOption {
  id: string;
  entityId: string;
  name: string;
  city: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
}
