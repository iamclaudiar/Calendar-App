import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Menu from './Menu';
import '../style/Style.css';

const api = "http://localhost:8080";

const localizer = momentLocalizer(moment);

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUserName] = useState(null);
  const [role, setRole] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingEventName, setEditingEventName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingStartTime, setEditingStartTime] = useState("");
  const [editingEndTime, setEditingEndTime] = useState("");
  const [requestEvents, setRequestEvents] = useState([]);
  const [type, setType] = useState("");
  const [editingType, setEditingType] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingDate, setEditingDate] = useState(new Date());
  const [showEditForm, setShowEditForm] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [editingTrainer, setEditingTrainer] = useState("");
  const [trainerName, setTrainerName] = useState("");
  const [memberNames, setMemberNames] = useState({});
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [editingLocation, setEditingLocation] = useState("");
  const [selectedEventLocation, setSelectedEventLocation] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [subscription, setSubscription] = useState(null);
  const [eventCount, setEventCount] = useState(0);
  const [maxMembers, setMaxMembers] = useState(0);
  const [editingMaxMembers, setEditingMaxMembers] = useState(0);

  const [selectedFilterType, setSelectedFilterType] = useState("");
  const [selectedFilterTrainer, setSelectedFilterTrainer] = useState("");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState("");
  const [selectedFilterLocation, setSelectedFilterLocation] = useState("");
  const [filterOwnEvents, setFilterOwnEvents] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.name);
      setUserId(decodedToken.id);
      setRole(decodedToken.role);
      getRequestEvents(token);
      getTrainers(token);
      getLocations(token);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedEvent && selectedEvent.trainer) {
      getTrainer(selectedEvent.trainer);
    }
  }, [selectedEvent]);

  useEffect(() => {
      setCurrentDate(new Date());
    }, []);

  const getTrainer = async (trainerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(api + `/api/trainers/${trainerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTrainerName(response.data.name);
    } catch (error) {
      console.error('Error fetching trainer:', error);
    }
  };

  const getMember = async (memberId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(api + `/api/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.name;
    } catch (error) {
      console.error('Error fetching member:', error);
      return '';
    }
  };  

  const getLocations = async (token) => {
    try {
      const response = await axios.get(api + `/api/locations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLocations(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getLocation = async (locationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(api + `/api/locations/${locationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return `${response.data.building} - ${response.data.room}`;
    } catch (error) {
      console.error('Error fetching location:', error);
      return '';
    }
  };

  useEffect(() => {
    if (selectedEvent && selectedEvent.location) {
      getLocation(selectedEvent.location).then((location) => setSelectedEventLocation(location));
    }
  }, [selectedEvent]);
  

  const trainingTypes = ["Full Body", "Upper Body", "Lower Body", // fitness
                        "Kangoo Jumps", "Zumba", "Mix Dance", // zumba
                        "Yoga", "Meditation", // yoga
                        "Pilates"]; // pilates

  const eventColors = {
                      "Full Body": "#ef476f",
                      "Upper Body": "#ffd166",
                      "Lower Body": "#06d6a0",
                      "Kangoo Jumps": "#118ab2",
                      "Zumba": "#073b4c",
                      "Mix Dance": "#57cc99",
                      "Yoga": "#e76f51",
                      "Meditation": "#f4a261",
                      "Pilates": "#2a9d8f"
                    };

  const eventStyleGetter = (event) => {
              const backgroundColor = eventColors[event.type] || "#0000FF";
              const style = {
                        backgroundColor,
                        borderRadius: '0px',
                        opacity: 0.8,
                        color: 'white',
                        border: '0px',
                        display: 'block'
                      };
                      return {
                        style
                      };
                    };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleEditingTypeChange = (event) => {
    setEditingType(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setSelectedFilterType(event.target.value);
  };
  
  const handleFilterTrainerChange = (event) => {
    setSelectedFilterTrainer(event.target.value);
  };

  const handleFilterLocationChange = (event) => {
    setSelectedFilterLocation(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setSelectedFilterStatus(event.target.value);
  };

  const handleFilterOwnEventsChange = () => {
    setFilterOwnEvents(!filterOwnEvents);
  };

  const getRequestEvents = async (token) => {
    try {
      const response = await axios.get(api + `/api/events/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const events = response.data;
      const memberIds = new Set();
      events.forEach(event => event.memberIds.forEach(id => memberIds.add(id)));
  
      const memberNamesMap = {};
      await Promise.all([...memberIds].map(async id => {
        const name = await getMember(id);
        memberNamesMap[id] = name;
      }));
  
      setMemberNames(memberNamesMap);
      setRequestEvents(events);
    } catch (err) {
      console.log(err);
    }
  };
  

const getTrainers = async (token) => {
    try {
      const response = await axios.get(api + `/api/trainers/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTrainers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (requestEvents.length > 0) {
      const processedEvents = requestEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        members: event.memberIds,
        type: event.type,
        trainer: event.trainerId,
        location: event.locationId,
        status: event.eventStatus,
        maxMembers: event.maxMembers
      }));
      setEvents(processedEvents);
    }
  }, [requestEvents]);

  useEffect(() => {
    if (role === "TRAINER" && requestEvents.length > 0) {
      const filteredEvents = requestEvents.filter(event => 
        (!selectedFilterType || event.type === selectedFilterType) &&
        (!selectedFilterTrainer || event.trainerId === selectedFilterTrainer) &&
        (!filterOwnEvents || event.trainerId === userId) && 
        (!selectedFilterStatus || event.eventStatus === selectedFilterStatus) &&
        (!selectedFilterLocation || event.locationId === selectedFilterLocation)
      );
      const processedEvents = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        members: event.memberIds,
        type: event.type,
        trainer: event.trainerId,
        location: event.locationId,
        status: event.eventStatus,
        maxMembers: event.maxMembers
      }));
      setEvents(processedEvents);
    }

    if (role === "MEMBER" && requestEvents.length > 0) {
      const filteredEvents = requestEvents.filter(event => 
        (!selectedFilterType || event.type === selectedFilterType) &&
        (!selectedFilterTrainer || event.trainerId === selectedFilterTrainer) &&
        (!filterOwnEvents || (event.memberIds && event.memberIds.includes(userId))) &&
        (!selectedFilterStatus || event.eventStatus === selectedFilterStatus) &&
        (!selectedFilterLocation || event.locationId === selectedFilterLocation)
      );
      const processedEvents = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        members: event.memberIds,
        type: event.type,
        trainer: event.trainerId,
        location: event.locationId,
        status: event.eventStatus,
        maxMembers: event.maxMembers
      }));
      setEvents(processedEvents);
    }

    if (role === "GYMMANAGEMENT" && requestEvents.length > 0) {
      const filteredEvents = requestEvents.filter(event => 
        (!selectedFilterType || event.type === selectedFilterType) &&
        (!selectedFilterTrainer || event.trainerId === selectedFilterTrainer) &&
        (!selectedFilterStatus || event.eventStatus === selectedFilterStatus) &&
        (!selectedFilterLocation || event.locationId === selectedFilterLocation)
      );
      const processedEvents = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        members: event.memberIds,
        type: event.type,
        trainer: event.trainerId,
        location: event.locationId,
        status: event.eventStatus,
        maxMembers: event.maxMembers
      }));
      setEvents(processedEvents);
    }
    
  }, [requestEvents, selectedFilterType, selectedFilterTrainer, filterOwnEvents, selectedFilterStatus, selectedFilterLocation, userId, role]);

  const Create_Event = async () => {
    if (selectedDate && eventName && startTime && endTime && selectedLocation && role === "GYMMANAGEMENT") {
      const startHours = parseInt(startTime.split(':')[0]) + 3;
      const startMinutes = parseInt(startTime.split(':')[1]);
      const endHours = parseInt(endTime.split(':')[0]) + 3;
      const endMinutes = parseInt(endTime.split(':')[1]);
  
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(startHours, startMinutes, 0, 0);
  
      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endHours, endMinutes, 0, 0);
  
      const newEvent = {
        title: eventName,
        description: eventDescription,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        trainerId: selectedTrainer,
        type: type,
        locationId: selectedLocation,
        maxMembers: maxMembers
      };
  
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(api + `/api/events`, newEvent, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          setEvents([...events, {
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            start: new Date(response.data.startTime),
            end: new Date(response.data.endTime),
            members: response.data.memberIds,
            trainer: response.data.trainerId,
            type: response.data.type,
            location: response.data.locationId,
            status: response.data.eventStatus,
            maxMembers: response.data.maxMembers
          }]);
          setEventName("");
          setEventDescription("");
          setStartTime("");
          setEndTime("");
          setSelectedDate(null);
          setSelectedTrainer("");
          setType("");
          setSelectedLocation("");
          setMaxMembers(0);
        }
      } catch (error) {
        console.error('Error adding event:', error);
        alert('Failed to add event. Please try again.');
      }
    }
  };

const Start_Update_Event = (event) => {
    setEditingEventId(event.id);
    setEditingEventName(event.title);
    setEditingDescription(event.description);
    setEditingStartTime(event.start.toISOString().substring(11, 16));
    setEditingEndTime(event.end.toISOString().substring(11, 16));
    setEditingDate(new Date(event.start));
    setEditingTrainer(event.trainer);
    setEditingType(event.type);
    setEditingMaxMembers(event.maxMembers);
    setSelectedEvent(event);
    setShowEditForm(false);
  };

  const Save_Updated_Event = async (eventId) => {
    if (editingEventName && editingStartTime && editingEndTime && editingLocation && role === "GYMMANAGEMENT") {
      const startHours = parseInt(editingStartTime.split(':')[0]) + 3;
      const startMinutes = parseInt(editingStartTime.split(':')[1]);
      const endHours = parseInt(editingEndTime.split(':')[0]) + 3;
      const endMinutes = parseInt(editingEndTime.split(':')[1]);
  
      const startDateTime = new Date(editingDate);
      startDateTime.setHours(startHours, startMinutes, 0, 0);
  
      const endDateTime = new Date(editingDate);
      endDateTime.setHours(endHours, endMinutes, 0, 0);
  
      const updatedEvent = {
        title: editingEventName,
        description: editingDescription,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        trainerId: editingTrainer,
        type: editingType,
        locationId: editingLocation,
        maxMembers: editingMaxMembers
      };
  
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(api + `/api/events/${eventId}`, updatedEvent, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data) {
          const updatedEvents = events.map((event) =>
            event.id === eventId ? {
              ...event,
              title: response.data.title,
              description: response.data.description,
              start: new Date(response.data.startTime),
              end: new Date(response.data.endTime),
              type: response.data.type,
              trainer: response.data.trainerId,
              location: response.data.locationId,
              status: response.data.eventStatus,
              maxMembers: response.data.maxMembers
            } : event
          );
          setEvents(updatedEvents);
          setEditingEventId(null);
          setEditingEventName("");
          setEditingDescription("");
          setEditingStartTime("");
          setEditingEndTime("");
          setEditingDate(new Date());
          setEditingType("");
          setEditingTrainer("");
          setSelectedEvent(null);
          setEditingLocation("");
          setEditingMaxMembers(0);
          setShowEditForm(false);
        }
      } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event. Please try again.');
      }
    }
  };

const Delete_Event = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(api + `/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const joinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const memberId = decodedToken.id;
      
      if  ((subscription.subscriptionType === 'basic') && (eventCount >= 1)) {
        alert('Your subscription is basic - only one train per day!');
      } else {
        const response = await axios.post(api + `/api/events/addMember/${eventId}`, null, {
        params: { memberId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        getRequestEvents(token);
        alert('Successfully joined the event!');
      }
      fetchEventCount(memberId);
    }
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join the event. Please try again.');
    }
  };

  const unjoinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const memberId = decodedToken.id;
  
      const response = await axios.post(api + `/api/events/deleteMember/${eventId}`, null, {
        params: { memberId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        getRequestEvents(token);
        alert('Successfully unjoined the event!');
      }
    } catch (error) {
      console.error('Error unjoining event:', error);
      alert('Failed to unjoin the event. Please try again.');
    }
  };

  useEffect(() => {
    const fetchSubscription = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const memberId = decodedToken.id;
            try {
                const response = await axios.get(api + `/api/subscriptions/member/${memberId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setSubscription(response.data);
            } catch (error) {
                console.error('Failed to get subscription', error);
                alert('Failed to get subscription');
            }
        }
    };

    fetchSubscription();
}, []);

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const fetchEventCount = async (memberId) => {
  try {
    const token = localStorage.getItem('token');
    if(token) {
      const formattedDate = getFormattedDate(selectedDate);

      const response = await axios.get(api + `/api/events/count/${memberId}`, {
      params: { localDate: formattedDate },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setEventCount(response.data);
  }
  } catch (error) {
    console.error('Error fetching event count:', error);
  }
};

useEffect(() => {
  if (userId) {
    fetchEventCount(userId);
  }
}, [userId, selectedDate, selectedEvent]);

const handleSelectSlot = ({ start }) => {
  setSelectedDate(start);
  if (userId) {
    fetchEventCount(userId);
  }
};

const handleSelectEvent = (event) => {
  setSelectedDate(new Date(event.start));
  Start_Update_Event(event);
  if (userId) {
    fetchEventCount(userId);
  }
};

  return (
    <div className="app">
    <Menu username={username}/>
      <h1>EVENT CALENDAR APPLICATION</h1>
      <div>
      <div>
        <label>Filter by type: </label>
            <select value={selectedFilterType} onChange={handleFilterTypeChange}>
                <option value="">All types</option>
                {trainingTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
                ))}
            </select>
        </div>
        <div>
        <label>Filter by trainer: </label>
        <select value={selectedFilterTrainer} onChange={handleFilterTrainerChange}>
            <option value="">All trainers</option>
            {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>{trainer.name}: [{trainer.skills.join(", ")}]</option>
            ))}
        </select>
        </div>
        <div>
          <label>Filter by location: </label>
          <select value={selectedFilterLocation} onChange={handleFilterLocationChange}>
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.building} - {location.room}</option>
            ))}
          </select>
        </div>
        <div>
            <label>Filter by status: </label>
            <select value={selectedFilterStatus} onChange={handleFilterStatusChange}>
              <option value="">All statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
            </select>
          </div>

        { (role === "TRAINER" || role === "MEMBER") && (
        <div>
        <label>
            <input 
            type="checkbox"
            checked={filterOwnEvents}
            onChange={handleFilterOwnEventsChange}
            />
            Show only my events
        </label>
        </div>
        )}

        <div>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
          />
        </div>
        <div>
          {selectedEvent && (
            <div className="event-details">
              <h2>Event details</h2>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Start time:</strong> {selectedEvent.start.toLocaleString()}</p>
              <p><strong>End time:</strong> {selectedEvent.end.toLocaleString()}</p>
              <p><strong>Type:</strong> {selectedEvent.type}</p>
              <p><strong>Trainer:</strong> {trainerName} </p>
              { (role === 'GYMMANAGEMENT' || role === 'TRAINER') && (
              <p><strong>Members:</strong> {selectedEvent.members.map(memberId => memberNames[memberId]).join(", ")}</p>
              )}
              <p><strong>Location:</strong> {selectedEventLocation}</p>
              { role === 'GYMMANAGEMENT' && (
                <div>
                    <button onClick={() => Delete_Event(selectedEvent.id)}>Delete event</button>
                    <button onClick={() => setShowEditForm(true)}>Edit event</button>
                </div>
              )}
              { role === 'MEMBER' && selectedEvent.status === "upcoming" && subscription && (new Date(subscription.expirationDate) > new Date(selectedEvent.start)) && ((selectedEvent.members.length < selectedEvent.maxMembers) || (selectedEvent.members.includes(userId))) && (
              <button onClick={() => {
                if (selectedEvent.members.includes(userId)) {
                  unjoinEvent(selectedEvent.id);
                } else {
                  joinEvent(selectedEvent.id);
                }
              }}>
                {selectedEvent.members.includes(userId) ? "Unjoin Event" : "Join Event"}
              </button>
            )}
            </div>
          )}
          {showEditForm && role === 'GYMMANAGEMENT' && (
            <div className="edit-event">
              <h2>Edit event</h2>
              <label>Name: </label>
              <input
                type="text"
                placeholder="Event Name"
                value={editingEventName}
                onChange={(e) => setEditingEventName(e.target.value)}
              />
              <br/>
              <label>Description: </label>
              <br/>
              <textarea
                placeholder="Description"
                value={editingDescription}
                onChange={(e) => setEditingDescription(e.target.value)}
                rows="5"
                cols="50"
              />
              <br/>
              <label>Event date: </label>
              <input
                type="date"
                value={editingDate.toISOString().substring(0, 10)}
                onChange={(e) => setEditingDate(new Date(e.target.value))}
              />
              <br/>
              <label>Start time: </label>
              <input
                type="time"
                value={editingStartTime}
                onChange={(e) => setEditingStartTime(e.target.value)}
              />
              <br/>
              <label>End time: </label>
              <input
                type="time"
                value={editingEndTime}
                onChange={(e) => setEditingEndTime(e.target.value)}
              />
              <br/>
              <div>
                <label>Type: </label>
                {trainingTypes.map((type) => (
                  <div key={type}>
                    <label>
                      <input 
                        type="radio" 
                        value={type}
                        checked={editingType === type}
                        onChange={handleEditingTypeChange}
                      />
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <label>Trainer: </label>
                <select value={editingTrainer} onChange={(e) => setEditingTrainer(e.target.value)}>
                    <option value="">Select trainer</option>
                    {trainers.map((trainer) => (
                        <option key={trainer.id} value={trainer.id}>{trainer.name}: [{trainer.skills.join(", ")}]</option>
                    ))}
                </select>
                </div>
                <br/>
                <div>
                  <label>Location: </label>
                  <select value={editingLocation} onChange={(e) => setEditingLocation(e.target.value)}>
                    <option value="">Select location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>{location.building} - {location.room}</option>
                    ))}
                  </select>
                </div>
                <br/>
                <label>Max members: </label>
                <input
                  type="number"
                  placeholder="Max members"
                  value={editingMaxMembers}
                  onChange={(e) => setEditingMaxMembers(e.target.value)}
                />
                <br/><br/>
              <button onClick={() => Save_Updated_Event(editingEventId)}>Save event</button>
              <button onClick={() => setShowEditForm(false)}>Cancel</button>
            </div>
          )}
          {selectedDate && role === 'GYMMANAGEMENT' && currentDate < selectedDate && (
            <div className="create-event">
              <h2>Create event</h2>
              <p>Selected date: {selectedDate.toDateString()}</p>
              <label>Name: </label>
              <input
                type="text"
                placeholder="Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <br/>
              <label>Description: </label>
              <br/>
              <textarea
                placeholder="Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows="5"
                cols="50"
              />
              <br/>
              <label>Start time: </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <br/>
              <label>End time: </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <br/>
              <div>
                <label>Type: </label>
                {trainingTypes.map((trainingType) => (
                  <div key={trainingType}>
                    <label>
                      <input 
                        type="radio" 
                        value={trainingType} 
                        checked={type === trainingType}
                        onChange={handleTypeChange}
                      />
                      {trainingType}
                    </label>
                  </div>
                ))}
              </div>
              <br/>
              <div>
                <label>Trainer: </label>
                <select value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)}>
                <option value="">Select trainer</option>
                {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>{trainer.name}: [{trainer.skills.join(", ")}]</option>
                ))}
                </select>
            </div>
            <br/>
            <div>
              <label>Location: </label>
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                <option value="">Select location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>{location.building} - {location.room}</option>
                ))}
              </select>
            </div>
            <br/>
            <label>Maximum members: </label>
            <input
            type="number"
            placeholder="Max members"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
          />
            <br/><br/>
              <button onClick={Create_Event}>Create event</button>
            </div>
          )} 
        </div>
      </div>
    </div>
  );
};

export default Home;
