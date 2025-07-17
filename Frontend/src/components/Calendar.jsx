import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import AppointmentForm from './AppointmentForm';
import { patients as initialPatients, doctors as initialDoctors } from '../data/clinicData';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ onLogout }) => {
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
    return savedAppointments.map(a => ({
      ...a,
      start: new Date(a.start),
      end: new Date(a.end),
    }));
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filter, setFilter] = useState({ patient: '', doctor: '' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [navigatedDate, setNavigatedDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSelectSlot = ({ start }) => {
    if (start < new Date().setHours(0, 0, 0, 0)) {
      return;
    }
    setSelectedDate(start);
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedAppointment(event);
    setIsModalOpen(true);
  };

  const handleSaveAppointment = (appointment) => {
    if (selectedAppointment) {
      setAppointments(
        appointments.map((a) =>
          a.id === selectedAppointment.id ? { ...a, ...appointment } : a
        )
      );
    } else {
      setAppointments([
        ...appointments,
        { ...appointment, id: new Date().getTime() },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      setAppointments(
        appointments.filter((a) => a.id !== selectedAppointment.id)
      );
      setIsModalOpen(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      (filter.patient === '' || a.patient === filter.patient) &&
      (filter.doctor === '' || a.doctor === filter.doctor)
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`p-4 ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Clinic Calendar</h1>
            <div className="flex items-center">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 mr-4"
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Logout
                </button>
            </div>
        </div>
        <div className="flex gap-4 mb-4">
            <select
                value={filter.patient}
                onChange={(e) => setFilter({ ...filter, patient: e.target.value })}
                className="p-2 border rounded"
            >
                <option value="">All Patients</option>
                {initialPatients.map((p) => (
                    <option key={p.id} value={p.name}>
                        {p.name}
                    </option>
                ))}
            </select>
            <select
                value={filter.doctor}
                onChange={(e) => setFilter({ ...filter, doctor: e.target.value })}
                className="p-2 border rounded"
            >
                <option value="">All Doctors</option>
                {initialDoctors.map((d) => (
                    <option key={d.id} value={d.name}>
                        {d.name}
                    </option>
                ))}
            </select>
        </div>
      {isMobile ? (
        <div>
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="w-full p-2 border rounded mb-4"
          />
          <div className="space-y-4">
            {filteredAppointments
              .filter(
                (a) =>
                  format(new Date(a.start), 'yyyy-MM-dd') ===
                  format(selectedDate, 'yyyy-MM-dd')
              )
              .map((appointment) => (
                <div
                  key={appointment.id}
                  onClick={() => handleSelectEvent(appointment)}
                  className="p-4 rounded-lg shadow-md bg-white cursor-pointer"
                >
                  <p className="font-bold">{appointment.title}</p>
                  <p>{`${format(new Date(appointment.start), 'p')} - ${format(
                    new Date(appointment.end),
                    'p'
                  )}`}</p>
                  <p>Patient: {appointment.patient}</p>
                  <p>Doctor: {appointment.doctor}</p>
                </div>
              ))}
          </div>
            <button
                onClick={() => {
                    setSelectedAppointment(null);
                    setIsModalOpen(true);
                }}
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg"
            >
                +
            </button>
        </div>
      ) : (
        <div className="relative h-[calc(100vh-250px)] z-0">
          <Calendar
            localizer={localizer}
            events={filteredAppointments.map(a => ({...a, title: `${a.patient} - ${a.doctor}`}))}
            startAccessor="start"
            endAccessor="end"
            className="h-full"
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            date={navigatedDate}
            onNavigate={(date) => setNavigatedDate(date)}
          />
        </div>
      )}
      {isModalOpen && (
        <AppointmentForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAppointment}
          onDelete={handleDeleteAppointment}
          appointment={selectedAppointment}
          date={selectedDate}
          patients={initialPatients}
          doctors={initialDoctors}
        />
      )}
    </div>
  );
};

export default CalendarView;