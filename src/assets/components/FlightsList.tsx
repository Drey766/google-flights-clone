import React, { useState, useMemo } from 'react';
import type { FlightOffer } from '../types';
import './FlightsList.css'; 
import { Button } from '@mui/material';

interface FlightsListProps {
  flights: FlightOffer[];
}

const FlightsList: React.FC<FlightsListProps> = ({ flights }) => {
  const [expandedFlights, setExpandedFlights] = useState<Set<string>>(new Set());

  const [sortBy, setSortBy] = useState('score');

  const sortedFlights = useMemo(() => {
    if (!flights || flights.length === 0) return [];
    
    return [...flights].sort((a, b) => {
      if (sortBy === 'price') {
        const priceA = parseFloat(a.price?.formatted?.replace(/[$,]/g, '') || '0');
        const priceB = parseFloat(b.price?.formatted?.replace(/[$,]/g, '') || '0');
        return priceA - priceB;
      } else if (sortBy === 'score') {
        return (b.score || 0) - (a.score || 0);
      }
      return 0;
    });
  }, [flights, sortBy]);

  if (!flights || flights.length === 0) {
    return <div className="no-flights">No flights found</div>;
  }

  const toggleFlightDetails = (flightId: string) => {
    const newExpanded = new Set(expandedFlights);
    if (newExpanded.has(flightId)) {
      newExpanded.delete(flightId);
    } else {
      newExpanded.add(flightId);
    }
    setExpandedFlights(newExpanded);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateTime: string): string => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStopsText = (stopCount: number): string => {
    if (stopCount === 0) return 'Nonstop';
    if (stopCount === 1) return '1 stop';
    return `${stopCount} stops`;
  };

  const getCarrierInfo = (leg: any) => {
    if (leg.carriers?.marketing && leg.carriers.marketing.length > 0) {
      return leg.carriers.marketing[0];
    }
    return null;
  };

  const getSegmentTravelTime = (segment: any): string => {
    if (segment.durationInMinutes) {
      return formatDuration(segment.durationInMinutes);
    }
    // Calculate from departure and arrival if duration not provided
    const dep = new Date(segment.departure);
    const arr = new Date(segment.arrival);
    const minutes = Math.floor((arr.getTime() - dep.getTime()) / (1000 * 60));
    return formatDuration(minutes);
  };

  return (
    <section className='flightList-container'>
      <div className="flightList-sortContainer">
        <h3 className='sort-title'>{sortBy=='price'? 'Cheapest Departing Flights' : 'Best Departing Flights'}</h3>
        <div className="sort-container">
          <span className="sort-text">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="price">Price (Low to High)</option>
            <option value="score">Best Match</option>
          </select>
        </div>
      </div>
      <ul className="flights-list">
        {sortedFlights.map((flight, index) => {
          const flightId = flight.id || `flight-${index}`;
          const isExpanded = expandedFlights.has(flightId);
      
          return (
            <li key={flightId} className="flight-card">
              {/* Main Flight Row */}
              <div className="flight-row">
                {flight.legs && flight.legs.length > 0 && (() => {
                  // Only show the first leg (departure/outbound) when collapsed
                  const leg = flight.legs[0];
                  const carrier = getCarrierInfo(leg);
      
                  return (
                    <div className="flight-leg-row">
                      {/* Carrier Logo */}
                      <div className="carrier-logo">
                        {carrier && (
                          <img
                            src={carrier.logoUrl}
                            alt={carrier.name}
                            width="32"
                            height="32"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      {/* Flight Times */}
                      <div className="flight-times">
                        <div className="departure-time">
                          <span className="time">{formatTime(leg.departure)}</span>
                          <span className="airport">{leg.origin.displayCode}</span>
                        </div>
                        <span>-</span>
                        <div className="arrival-time">
                          <span className="time">{formatTime(leg.arrival)}</span>
                          <span className="airport">{leg.destination.displayCode}</span>
                        </div>
      
                      </div>
                      <div className="flight-path">
                        {isExpanded ? (<Button className='selectFlight-button'>Select Flight</Button>): (
                          <div className="flight-pth-container">
                            <div className="duration">
                              <span>{formatDuration(leg.durationInMinutes)}</span>
                              <span className='duration-location'>{leg.origin.displayCode} - {leg.destination.displayCode}</span>
                            </div>
                            <div className="stops">
                              <span>{getStopsText(leg.stopCount)}</span>
                              <span>
                                {leg.segments && leg.segments.map((segment, segmentIndex) =>
                                  segmentIndex < leg.segments.length - 1 ? (
                                    <div key={segment.id || segmentIndex} className="stops-layover">
                                      {segment.destination.displayCode}
                                    </div>
                                  ) : null
                                )}
                              </span>
                            </div>
                          </div>
                        )
      
                      }
      
      
                      </div>
                  </div>
                  );
                })()}
                {/* Price and Actions */}
                <div className="flight-actions">
                  <div className="price">
                    <span className="amount">{flight.price?.formatted || 'N/A'}</span>
                  </div>
                  <div className="action-buttons">
                    <button
                      className="details-toggle"
                      onClick={() => toggleFlightDetails(flightId)}
                    >
                      <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Expandable Flight Details */}
              <div className={`flight-details ${isExpanded ? 'expanded' : 'collapsed'}`}>
                  {flight.legs && flight.legs.map((leg, legIndex) => (
                    <div key={leg.id || legIndex} className="leg-details">
                      <div className="leg-header">
                        <h4>{legIndex === 0 ? 'Departure' : 'Return'} • {formatDate(leg.departure)}</h4>
                        <span className="total-time">Total time: {formatDuration(leg.durationInMinutes)}</span>
                      </div>
                      <div className="segments-timeline">
                        {leg.segments && leg.segments.map((segment, segmentIndex) => (
                          <div key={segment.id || segmentIndex} className="segment-timeline">
                            {/* Departure */}
                            <div className="timeline-item">
                              <div className="timeline-dot departure-dot"></div>
                              <div className="timeline-content">
                                <div className="time-info">
                                  <span className="time">{formatTime(segment.departure)}</span>
                                  <span className="airport-name">
                                    {segment.origin.name} ({segment.origin.displayCode})
                                  </span>
                                </div>
                                
                              </div>
                            </div>
                            {/* Travel time */}
                            <div className="timeline-travel">
                              <span className='travel-line'></span>
                              <div className="travel-time">
                                Travel time: {getSegmentTravelTime(segment)}
                              </div>
                            </div>
                            {/* Arrival */}
                            <div className="timeline-item">
                              <div className="timeline-dot arrival-dot"></div>
                              <div className="timeline-content">
                                <div className="time-info">
                                  <span className="time">{formatTime(segment.arrival)}</span>
                                  <span className="airport-name">
                                    {segment.destination.name} ({segment.destination.displayCode})
                                  </span>
                                </div>
                                <div className="flight-info">
                                  <span className="flight-number">
                                    {segment.marketingCarrier?.name} {segment.flightNumber}
                                  </span>
                                  {segment.operatingCarrier && segment.operatingCarrier.id !== segment.marketingCarrier?.id && (
                                    <span className="operated-by">
                                      Operated by {segment.operatingCarrier.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* Layover (if not the last segment) */}
                            {segmentIndex < leg.segments.length - 1 && (
                              <div className="layover-info">
                                <div className="layover-dot"></div>
                                <div className="layover-text">
                                  <span></span>
                                  Layover in {segment.destination.name}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {/* Fare Policy */}
                      {flight.farePolicy && (
                        <div className="fare-info">
                          <div className="fare-details">
                            <span className={`policy-item ${flight.farePolicy.isChangeAllowed ? 'allowed' : 'not-allowed'}`}>
                              {flight.farePolicy.isChangeAllowed ? '✓' : '✗'} Changes
                            </span>
                            <span className={`policy-item ${flight.farePolicy.isCancellationAllowed ? 'allowed' : 'not-allowed'}`}>
                              {flight.farePolicy.isCancellationAllowed ? '✓' : '✗'} Cancellation
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FlightsList;