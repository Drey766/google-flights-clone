import React, { useState } from 'react';
import type { SearchParams } from '../types';
import './SearchForm.css'; 
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import PersonIcon from '@mui/icons-material/Person';
import FlightClassIcon from '@mui/icons-material/FlightClass';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Button } from '@mui/material';

interface Props {
  onSearch: (params: SearchParams) => void;
}

const SearchForm: React.FC<Props> = ({ onSearch }) => {
  const [form, setForm] = useState<SearchParams>({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'economy'
  });

  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [isSearching, setIsSearching] = useState(false);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [tempPassengers, setTempPassengers] = useState({
    adults: form.adults,
    children: form.children,
    infants: form.infants
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTripTypeChange = (type: 'roundtrip' | 'oneway') => {
    setTripType(type);
    if (type === 'oneway') {
      setForm({ ...form, returnDate: '' });
    }
  };

  const handlePassengerChange = (type: 'adults' | 'children' | 'infants', operation: 'add' | 'subtract') => {
    setTempPassengers(prev => {
      const newValue = operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      
      // Ensure at least 1 adult
      if (type === 'adults' && newValue < 1) {
        return prev;
      }
      
      // Limit infants to not exceed adults
      if (type === 'infants' && newValue > tempPassengers.adults) {
        return prev;
      }
      
      return { ...prev, [type]: newValue };
    });
  };

  const applyPassengerChanges = () => {
    setForm({
      ...form,
      adults: tempPassengers.adults,
      children: tempPassengers.children,
      infants: tempPassengers.infants
    });
    setShowPassengerDropdown(false);
  };

  const cancelPassengerChanges = () => {
    setTempPassengers({
      adults: form.adults,
      children: form.children,
      infants: form.infants
    });
    setShowPassengerDropdown(false);
  };

  const getTotalPassengers = () => {
    return form.adults + form.children + form.infants;
  };

  const getPassengerText = () => {
    const total = getTotalPassengers();
    if (total === 1) return '1';
    
    const parts = [];
    if (form.adults > 0) parts.push(`${form.adults} adult${form.adults > 1 ? 's' : ''}`);
    if (form.children > 0) parts.push(`${form.children} child${form.children > 1 ? 'ren' : ''}`);
    if (form.infants > 0) parts.push(`${form.infants} infant${form.infants > 1 ? 's' : ''}`);
    
    return `${total}`;
  };

  const validateForm = () => {
    if (form.returnDate && form.returnDate < form.departureDate) {
      alert('Return date must be after departure date');
      return false;
    }
    if (form.adults < 1) {
      alert('At least 1 adult is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSearching(true);
      try {
        await onSearch(form);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <section className='searchFormContainer'>
      <form className='searchForm' onSubmit={handleSubmit}>
        {/* Trip Type Selection */}
        <div className="trip-selections">
          <div className="input-group dropdown-menus">
            <label htmlFor="tripType" className='tripType-label'>{tripType=='oneway' ? <ArrowRightAltIcon /> : <SyncAltIcon /> }</label>
            <select 
              id="tripType"
              name="tripType" 
              value={tripType} 
              onChange={(e) => handleTripTypeChange(e.target.value as 'roundtrip' | 'oneway')}
              className='trip-type-dropdown'
            >
              <option value="roundtrip" className='tripType-option'>Round Trip</option>
              <option value="oneway" className='tripType-option'>One Way</option>
            </select>
        </div>
          {/* Passengers Dropdown */}
        <div className="input-group passenger-dropdown">
          <div className="passenger-field-container">
            <div className="passenger-field" onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}>
              <label className='passenger-label'><PersonIcon /></label>
              <span className='passanger-text'>{getPassengerText()}</span>
              <span className="dropdown-arrow">{showPassengerDropdown ? '▲' : '▼'}</span>
            </div>
            
            {showPassengerDropdown && (
              <div className="passenger-options">
                <div className="passenger-row">
                  <div className="passenger-info">
                    <span>Adults</span>
                    <small>12+ years</small>
                  </div>
                  <div className="passenger-controls">
                    <button 
                      type="button" 
                      className='passenger-button'
                      onClick={() => handlePassengerChange('adults', 'subtract')}
                      disabled={tempPassengers.adults <= 1}
                    >
                      -
                    </button>
                    <span>{tempPassengers.adults}</span>
                    <button 
                      type="button" 
                      className='passenger-button'
                      onClick={() => handlePassengerChange('adults', 'add')}
                      disabled={tempPassengers.adults >= 9}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="passenger-row">
                  <div className="passenger-info">
                    <span>Children</span>
                    <small>2-11 years</small>
                  </div>
                  <div className="passenger-controls">
                    <button 
                      type="button" 
                      onClick={() => handlePassengerChange('children', 'subtract')}
                      disabled={tempPassengers.children <= 0}
                      className='passenger-button'
                    >
                      -
                    </button>
                    <span>{tempPassengers.children}</span>
                    <button 
                      type="button" 
                      onClick={() => handlePassengerChange('children', 'add')}
                      disabled={tempPassengers.children >= 9}
                      className='passenger-button'
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="passenger-row">
                  <div className="passenger-info">
                    <span>Infants</span>
                    <small>Under 2 years</small>
                  </div>
                  <div className="passenger-controls">
                    <button 
                      type="button" 
                      onClick={() => handlePassengerChange('infants', 'subtract')}
                      disabled={tempPassengers.infants <= 0}
                      className='passenger-button'
                    >
                      -
                    </button>
                    <span>{tempPassengers.infants}</span>
                    <button 
                      type="button" 
                      onClick={() => handlePassengerChange('infants', 'add')}
                      disabled={tempPassengers.infants >= tempPassengers.adults}
                      className='passenger-button'
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="passenger-actions">
                  <Button className="passengerAction-button" onClick={cancelPassengerChanges}>Cancel</Button>
                  <Button className="passengerAction-button" onClick={applyPassengerChanges}>OK</Button>
                </div>
              </div>
            )}
          </div>
        </div>

          {/* Travel Class */}
          <div className="input-group dropdown-menus">
            <label htmlFor="travelClass" className='travelClass-label'><FlightClassIcon /></label>
            <select 
              id="travelClass"
              name="travelClass" 
              value={form.travelClass} 
              onChange={handleChange}
              className='travelClass-dropdown'
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        {/* Origin */}
        <div className="trip-inputs">
          <div className="trip-location">
            <div className="input-group location-input">
              <label htmlFor="origin" className='location-label'><LocationOnIcon /> </label>
              <input
                id="origin"
                name="origin"
                className='location-input-field'
                value={form.origin}
                onChange={handleChange}
                placeholder="Where from?"
                required
              />
            </div>
            {/* Destination */}
            <div className="input-group location-input">
              <label htmlFor="destination" className='location-label'><LocationOnIcon /> </label>
              <input
                id="destination"
                name="destination"
                value={form.destination}
                className='location-input-field'
                onChange={handleChange}
                placeholder="Where to?"
                required
              />
            </div>
          </div>
          <div className="trip-dates">
            {/* Departure Date */}
            <div className="input-group date-input">
              <label htmlFor="departureDate" className='date-label'><CalendarMonthIcon /> </label>
              <input 
                id="departureDate"
                className='date-input-field'
                name="departureDate" 
                type="text"
                placeholder="Depature date"
                onFocus={e => (e.currentTarget.type = 'date')}
                onBlur={e => { if (!e.currentTarget.value) e.currentTarget.type = 'text'; }}
                value={form.departureDate} 
                onChange={handleChange} 
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
            {/* Return Date */}
            {tripType === 'roundtrip' && (
              <div className="input-group date-input">
                <label htmlFor="returnDate" className='date-label'><CalendarTodayIcon /> </label>
                <input 
                  id="returnDate"
                  className='date-input-field'
                  name="returnDate" 
                  type="text"
                  placeholder="Return date"
                  onFocus={e => (e.currentTarget.type = 'date')}
                  onBlur={e => { if (!e.currentTarget.value) e.currentTarget.type = 'text'; }}
                  value={form.returnDate} 
                  onChange={handleChange}
                  min={form.departureDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            )}
          </div>
        </div>
        {/* Submit Button */}
        <div className="search-button-container">
          <Button type="submit" disabled={isSearching} className='search-button'>
            {isSearching ? 'Searching...' : 'Explore'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default SearchForm;