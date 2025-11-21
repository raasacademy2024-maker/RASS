import React, { useState } from 'react';
import { FileText, Star, MessageSquare, Check, X, Download } from 'lucide-react';
import { assignmentAPI } from '../../services/api';
import { Assignment, Submission } from '../../types';
import { motion } from 'framer-motion';

interface AssignmentGradingProps {
  assignment: Assignment;
  onGraded: () => void;
}

export const AssignmentGrading: React.FC<AssignmentGradingProps> = ({
  assignment,
  onGraded,
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const ungradedSubmissions = assignment.submissions?.filter(
    s => s.grade === undefined || s.grade === null
  ) || [];
  
  const gradedSubmissions = assignment.submissions?.filter(
    s => s.grade !== undefined && s.grade !== null
  ) || [];

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade || 0);
    setFeedback(submission.feedback || '');
  };

  const handleSubmitGrade = async () => {
    if (!selectedSubmission) return;

    try {
      setSaving(true);
      await assignmentAPI.gradeAssignment(assignment._id, {
        submissionId: selectedSubmission._id,
        grade: grade,
        feedback: feedback
      });
      
      alert('Grade submitted successfully!');
      onGraded();
      setSelectedSubmission(null);
      setGrade(0);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting grade:', error);
      alert('Failed to submit grade. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Submissions List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Ungraded Submissions */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
            <h3 className="font-semibold text-orange-900">
              Pending ({ungradedSubmissions.length})
            </h3>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {ungradedSubmissions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No pending submissions
              </div>
            ) : (
              ungradedSubmissions.map(submission => (
                <button
                  key={submission._id}
                  onClick={() => handleSelectSubmission(submission)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                    selectedSubmission?._id === submission._id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900 text-sm">
                    {typeof submission.student === 'object' ? submission.student.name : 'Student'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Graded Submissions */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-green-50 border-b border-green-100">
            <h3 className="font-semibold text-green-900">
              Graded ({gradedSubmissions.length})
            </h3>
          </div>
          <div className="divide-y max-h-[300px] overflow-y-auto">
            {gradedSubmissions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No graded submissions
              </div>
            ) : (
              gradedSubmissions.map(submission => (
                <button
                  key={submission._id}
                  onClick={() => handleSelectSubmission(submission)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                    selectedSubmission?._id === submission._id ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {typeof submission.student === 'object' ? submission.student.name : 'Student'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {submission.grade}/{assignment.maxPoints}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Grading Panel */}
      <div className="lg:col-span-2">
        {!selectedSubmission ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Select a submission to grade
            </p>
          </div>
        ) : (
          <motion.div
            key={selectedSubmission._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Submission Header */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {typeof selectedSubmission.student === 'object' 
                      ? selectedSubmission.student.name 
                      : 'Student Submission'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
                {selectedSubmission.grade !== undefined && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                    <Check className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-semibold text-green-700">
                      Graded
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Content */}
            <div className="p-6 space-y-6">
              {/* File Download */}
              {selectedSubmission.fileUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Download className="w-4 h-4 inline mr-2" />
                    Submitted File
                  </label>
                  <a
                    href={selectedSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Download className="w-4 h-4" />
                    Download Submission
                  </a>
                </div>
              )}

              {/* Content Text */}
              {selectedSubmission.content && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Content
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-700">
                    {selectedSubmission.content}
                  </div>
                </div>
              )}

              {/* Grading Section */}
              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  <Star className="w-5 h-5 inline mr-2" />
                  Grade Submission
                </h4>

                <div className="space-y-4">
                  {/* Grade Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade (out of {assignment.maxPoints})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={assignment.maxPoints}
                      value={grade}
                      onChange={(e) => setGrade(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            grade >= assignment.maxPoints * 0.9 ? 'bg-green-500' :
                            grade >= assignment.maxPoints * 0.7 ? 'bg-blue-500' :
                            grade >= assignment.maxPoints * 0.5 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(grade / assignment.maxPoints) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {Math.round((grade / assignment.maxPoints) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Feedback
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Provide detailed feedback to the student..."
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Previous Feedback (if already graded) */}
                  {selectedSubmission.gradedAt && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm font-medium text-blue-900 mb-1">
                        Previously Graded
                      </div>
                      <div className="text-xs text-blue-700">
                        Graded on {new Date(selectedSubmission.gradedAt).toLocaleString()}
                        {selectedSubmission.gradedBy && typeof selectedSubmission.gradedBy === 'object' && (
                          <> by {selectedSubmission.gradedBy.name}</>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleSubmitGrade}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      <Check className="w-5 h-5" />
                      {saving ? 'Saving...' : selectedSubmission.grade !== undefined ? 'Update Grade' : 'Submit Grade'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSubmission(null);
                        setGrade(0);
                        setFeedback('');
                      }}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
