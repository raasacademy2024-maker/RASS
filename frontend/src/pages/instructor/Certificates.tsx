import React, { useState, useEffect } from 'react';
import { certificateAPI, courseAPI, batchAPI } from '../../services/api';
import { Award, Download, Check, X, Users, FileCheck, RefreshCw } from 'lucide-react';

interface EligibleStudent {
  _id: string;
  name: string;
  email: string;
  enrollmentId: string;
  completedAt: string;
  batch?: {
    _id: string;
    name: string;
  };
  hasCertificate: boolean;
  certificate?: any;
}

interface Course {
  _id: string;
  title: string;
}

interface Batch {
  _id: string;
  name: string;
}

const InstructorCertificates: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [eligibleStudents, setEligibleStudents] = useState<EligibleStudent[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('B');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchBatches();
      fetchEligibleStudents();
    }
  }, [selectedCourse, selectedBatch]);

  const fetchMyCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchBatches = async () => {
    if (!selectedCourse) return;
    try {
      const response = await batchAPI.getCourseBatches(selectedCourse);
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([]);
    }
  };

  const fetchEligibleStudents = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const response = await certificateAPI.getEligibleStudents(
        selectedCourse,
        selectedBatch || undefined
      );
      setEligibleStudents(response.data);
    } catch (error) {
      console.error('Error fetching eligible students:', error);
      setEligibleStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.size === eligibleStudentsWithoutCerts.length) {
      setSelectedStudents(new Set());
    } else {
      const allIds = eligibleStudentsWithoutCerts.map(s => s._id);
      setSelectedStudents(new Set(allIds));
    }
  };

  const generateCertificate = async (studentId: string, studentName: string) => {
    if (!confirm(`Generate certificate for ${studentName}?`)) {
      return;
    }

    setProcessing(true);
    try {
      await certificateAPI.generateForStudent({
        studentId,
        courseId: selectedCourse,
        batchId: selectedBatch || undefined,
        grade: selectedGrade
      });
      alert(`Certificate generated successfully for ${studentName}!`);
      fetchEligibleStudents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate certificate');
    } finally {
      setProcessing(false);
    }
  };

  const bulkGenerateCertificates = async () => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student');
      return;
    }

    if (!confirm(`Generate certificates for ${selectedStudents.size} students?`)) {
      return;
    }

    setProcessing(true);
    try {
      const response = await certificateAPI.bulkGenerate({
        studentIds: Array.from(selectedStudents),
        courseId: selectedCourse,
        batchId: selectedBatch || undefined,
        grade: selectedGrade
      });

      const { summary } = response.data;
      alert(
        `Bulk generation completed!\n` +
        `Successful: ${summary.successful}\n` +
        `Skipped: ${summary.skipped}\n` +
        `Failed: ${summary.failed}`
      );
      
      setSelectedStudents(new Set());
      fetchEligibleStudents();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate certificates');
    } finally {
      setProcessing(false);
    }
  };

  const eligibleStudentsWithoutCerts = eligibleStudents.filter(s => !s.hasCertificate);
  const studentsWithCerts = eligibleStudents.filter(s => s.hasCertificate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="h-8 w-8 text-yellow-600" />
          Student Certificates
        </h1>
        <p className="text-gray-600 mt-2">Generate certificates for students who completed your courses</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course *
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedBatch('');
                setSelectedStudents(new Set());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Course --</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Batch (Optional)
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setSelectedStudents(new Set());
              }}
              disabled={!selectedCourse}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">All Batches</option>
              {batches.map(batch => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Grade
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
            </select>
          </div>
        </div>

        {selectedCourse && (
          <button
            onClick={fetchEligibleStudents}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh List
          </button>
        )}
      </div>

      {/* Statistics */}
      {selectedCourse && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Completed</p>
                <p className="text-3xl font-bold text-blue-900">{eligibleStudents.length}</p>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-50" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Certificates Issued</p>
                <p className="text-3xl font-bold text-green-900">{studentsWithCerts.length}</p>
              </div>
              <FileCheck className="h-12 w-12 text-green-600 opacity-50" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{eligibleStudentsWithoutCerts.length}</p>
              </div>
              <Award className="h-12 w-12 text-yellow-600 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {eligibleStudentsWithoutCerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedStudents.size === eligibleStudentsWithoutCerts.length && eligibleStudentsWithoutCerts.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedStudents.size > 0 
                  ? `${selectedStudents.size} student(s) selected` 
                  : 'Select all students'}
              </span>
            </div>
            
            {selectedStudents.size > 0 && (
              <button
                onClick={bulkGenerateCertificates}
                disabled={processing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                Generate {selectedStudents.size} Certificate(s)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Students Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : selectedCourse ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Eligible Students ({eligibleStudents.length})
            </h2>
          </div>

          {eligibleStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eligibleStudents.map((student) => (
                    <tr key={student._id} className={student.hasCertificate ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!student.hasCertificate && (
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(student._id)}
                            onChange={() => toggleStudentSelection(student._id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.batch?.name || 'No Batch'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(student.completedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.hasCertificate ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Issued
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <X className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.hasCertificate ? (
                          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => generateCertificate(student._id, student.name)}
                            disabled={processing}
                            className="text-green-600 hover:text-green-800 disabled:text-gray-400 flex items-center gap-1"
                          >
                            <Award className="h-4 w-4" />
                            Generate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No students have completed this course yet</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Please select a course to view eligible students</p>
        </div>
      )}
    </div>
  );
};

export default InstructorCertificates;
