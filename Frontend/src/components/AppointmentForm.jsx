import React, { useState, useEffect } from 'react';

const AppointmentForm = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  appointment,
  date,
  patients,
  doctors,
}) => {
  const [patient, setPatient] = useState('');
  const [doctor, setDoctor] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (appointment) {
      setPatient(appointment.patient);
      setDoctor(appointment.doctor);
      setTime(new Date(appointment.start).toTimeString().slice(0, 5));
    } else {
      setPatient('');
      setDoctor('');
      setTime('');
    }
  }, [appointment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const [hours, minutes] = time.split(':');
    const start = new Date(date);
    start.setHours(hours, minutes);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    onSave({
      patient,
      doctor,
      start,
      end,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {appointment ? 'Edit Appointment' : 'Add Appointment'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Patient</label>
            <select
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="" disabled>
                Select Patient
              </option>
              {patients.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Doctor</label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            >
              <option value="" disabled>
                Select Doctor
              </option>
              {doctors.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            {appointment && (
              <button
                type="button"
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;