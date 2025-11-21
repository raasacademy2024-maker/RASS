import React from 'react';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface ScheduleConfig {
  days: string[];
  startTime: string;
  endTime: string;
  timezone: string;
}

interface BatchScheduleFormProps {
  schedule: ScheduleConfig;
  onChange: (schedule: ScheduleConfig) => void;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const TIMEZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Asia/Singapore',
  'Australia/Sydney'
];

export const BatchScheduleForm: React.FC<BatchScheduleFormProps> = ({
  schedule,
  onChange
}) => {
  const toggleDay = (day: string) => {
    const newDays = schedule.days.includes(day)
      ? schedule.days.filter(d => d !== day)
      : [...schedule.days, day];
    onChange({ ...schedule, days: newDays });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        <CalendarIcon className="w-4 h-4 inline mr-2" />
        Batch Schedule
      </label>

      {/* Days Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Class Days
        </label>
        <div className="grid grid-cols-4 gap-2">
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                schedule.days.includes(day)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Start Time
          </label>
          <input
            type="time"
            value={schedule.startTime}
            onChange={(e) => onChange({ ...schedule, startTime: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            End Time
          </label>
          <input
            type="time"
            value={schedule.endTime}
            onChange={(e) => onChange({ ...schedule, endTime: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Timezone Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Timezone
        </label>
        <select
          value={schedule.timezone}
          onChange={(e) => onChange({ ...schedule, timezone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {TIMEZONES.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      {/* Schedule Preview */}
      {schedule.days.length > 0 && schedule.startTime && schedule.endTime && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900 font-medium mb-1">Schedule Preview:</p>
          <p className="text-sm text-blue-700">
            {schedule.days.join(', ')} • {schedule.startTime} - {schedule.endTime} ({schedule.timezone})
          </p>
        </div>
      )}
    </div>
  );
};
