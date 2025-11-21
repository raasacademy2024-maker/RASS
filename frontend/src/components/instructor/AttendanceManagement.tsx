import React, { useState, useEffect } from 'react';
import { Calendar, Users, Check, X, Clock, Save } from 'lucide-react';
import { attendanceAPI, batchAPI } from '../../services/api';
import { Batch } from '../../types';
import { motion } from 'framer-motion';

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface AttendanceRecord {
  student: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

interface AttendanceManagementProps {
  courseId: string;
  batchId: string;
}

export const AttendanceManagement: React.FC<AttendanceManagementProps> = ({
  courseId,
  batchId,
}) => {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDescription, setSessionDescription] = useState('');
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBatchData();
  }, [batchId]);

  const fetchBatchData = async () => {
    try {
      setLoading(true);
      
      // Fetch batch details
      const batchResponse = await batchAPI.getBatch(batchId);
      setBatch(batchResponse.data);

      // Fetch batch statistics to get enrolled students
      const statsResponse = await batchAPI.getBatchStats(batchId);
      setStudents(statsResponse.data.students || []);

      // Initialize attendance records
      const initialRecords: Record<string, AttendanceRecord> = {};
      (statsResponse.data.students || []).forEach((student: Student) => {
        initialRecords[student._id] = {
          student: student._id,
          status: 'absent',
          remarks: ''
        };
      });
      setRecords(initialRecords);
    } catch (error) {
      console.error('Error fetching batch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceStatus = (
    studentId: string,
    status: 'present' | 'absent' | 'late' | 'excused'
  ) => {
    setRecords({
      ...records,
      [studentId]: {
        ...records[studentId],
        status
      }
    });
  };

  const updateRemarks = (studentId: string, remarks: string) => {
    setRecords({
      ...records,
      [studentId]: {
        ...records[studentId],
        remarks
      }
    });
  };

  const markAllPresent = () => {
    const updatedRecords = { ...records };
    Object.keys(updatedRecords).forEach(studentId => {
      updatedRecords[studentId].status = 'present';
    });
    setRecords(updatedRecords);
  };

  const markAllAbsent = () => {
    const updatedRecords = { ...records };
    Object.keys(updatedRecords).forEach(studentId => {
      updatedRecords[studentId].status = 'absent';
    });
    setRecords(updatedRecords);
  };

  const handleSaveAttendance = async () => {
    if (!sessionTitle.trim()) {
      alert('Please enter a session title');
      return;
    }

    try {
      setSaving(true);
      
      const attendanceData = {
        course: courseId,
        batch: batchId,
        date: attendanceDate,
        title: sessionTitle,
        description: sessionDescription,
        records: Object.values(records)
      };

      await attendanceAPI.createAttendance(attendanceData);
      alert('Attendance saved successfully!');
      
      // Reset form
      setSessionTitle('');
      setSessionDescription('');
      setAttendanceDate(new Date().toISOString().split('T')[0]);
      
      // Reset records to absent
      const resetRecords: Record<string, AttendanceRecord> = {};
      students.forEach(student => {
        resetRecords[student._id] = {
          student: student._id,
          status: 'absent',
          remarks: ''
        };
      });
      setRecords(resetRecords);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: students.length
    };

    Object.values(records).forEach(record => {
      stats[record.status]++;
    });

    return stats;
  };

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Attendance Management
        </h2>
        {batch && (
          <p className="text-gray-600">
            Batch: {batch.name} • {students.length} students
          </p>
        )}
      </div>

      {/* Session Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Session Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Date *
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Session Title *
            </label>
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="e.g., Module 1 - Introduction to React"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={sessionDescription}
              onChange={(e) => setSessionDescription(e.target.value)}
              placeholder="Add any notes about this session..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={markAllPresent}
            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition text-sm font-medium"
          >
            <Check className="w-4 h-4 inline mr-1" />
            Mark All Present
          </button>
          <button
            type="button"
            onClick={markAllAbsent}
            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium"
          >
            <X className="w-4 h-4 inline mr-1" />
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Students</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-green-600">{stats.present}</div>
          <div className="text-sm text-gray-600">Present</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          <div className="text-sm text-gray-600">Absent</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
          <div className="text-sm text-gray-600">Late</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
          <div className="text-sm text-gray-600">Excused</div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">
            <Users className="w-5 h-5 inline mr-2" />
            Student Attendance
          </h3>
        </div>

        <div className="divide-y max-h-[600px] overflow-y-auto">
          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No students enrolled in this batch
            </div>
          ) : (
            students.map((student, index) => (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="p-4 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{student.name}</div>
                    <div className="text-sm text-gray-500 truncate">{student.email}</div>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => updateAttendanceStatus(student._id, 'present')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        records[student._id]?.status === 'present'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAttendanceStatus(student._id, 'absent')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        records[student._id]?.status === 'absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAttendanceStatus(student._id, 'late')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        records[student._id]?.status === 'late'
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAttendanceStatus(student._id, 'excused')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        records[student._id]?.status === 'excused'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Excused
                    </button>
                  </div>

                  {/* Remarks */}
                  <div className="w-full md:w-48">
                    <input
                      type="text"
                      value={records[student._id]?.remarks || ''}
                      onChange={(e) => updateRemarks(student._id, e.target.value)}
                      placeholder="Remarks..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSaveAttendance}
          disabled={saving || !sessionTitle.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>
    </div>
  );
};
