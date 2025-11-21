import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { userAPI } from '../../services/api';
import { Users, X } from 'lucide-react';

interface InstructorSelectorProps {
  selectedInstructors: string[];
  onChange: (instructorIds: string[]) => void;
  label?: string;
  required?: boolean;
}

export const InstructorSelector: React.FC<InstructorSelectorProps> = ({
  selectedInstructors,
  onChange,
  label = "Assign Instructors",
  required = false
}) => {
  const [instructors, setInstructors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await userAPI.getAllUsers();
      // Filter for instructors and admins only
      const instructorUsers = response.data.filter(
        (user: User) => user.role === 'instructor' || user.role === 'admin'
      );
      setInstructors(instructorUsers);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInstructor = (instructorId: string) => {
    if (selectedInstructors.includes(instructorId)) {
      onChange(selectedInstructors.filter(id => id !== instructorId));
    } else {
      onChange([...selectedInstructors, instructorId]);
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        <Users className="w-4 h-4 inline mr-2 animate-pulse" />
        Loading instructors...
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Users className="w-4 h-4 inline mr-2" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Selected Instructors Display */}
      {selectedInstructors.length > 0 && (
        <div className="mb-3 p-3 bg-indigo-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {instructors
              .filter(instructor => selectedInstructors.includes(instructor._id))
              .map(instructor => (
                <div
                  key={instructor._id}
                  className="flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm border border-indigo-200"
                >
                  <span className="font-medium text-gray-700">{instructor.name}</span>
                  <button
                    type="button"
                    onClick={() => handleToggleInstructor(instructor._id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Instructor Selection Grid */}
      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
        {instructors.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">
            No instructors available
          </div>
        ) : (
          instructors.map(instructor => (
            <label
              key={instructor._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={selectedInstructors.includes(instructor._id)}
                onChange={() => handleToggleInstructor(instructor._id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{instructor.name}</div>
                <div className="text-xs text-gray-500">{instructor.email}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${
                instructor.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {instructor.role}
              </div>
            </label>
          ))
        )}
      </div>

      {selectedInstructors.length === 0 && required && (
        <p className="mt-2 text-sm text-gray-500">
          Please select at least one instructor
        </p>
      )}
    </div>
  );
};
