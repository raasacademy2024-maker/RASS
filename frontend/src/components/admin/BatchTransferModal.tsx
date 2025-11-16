// frontend/src/components/admin/BatchTransferModal.tsx
import React, { useState, useEffect } from "react";
import { X, Users, ArrowRight } from "lucide-react";
import { batchAPI, enrollmentAPI } from "../../services/api";

interface Batch {
  _id: string;
  name: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
}

interface EnrolledStudent {
  student: {
    _id: string;
    name: string;
    email: string;
  };
  progress?: number;
}

interface BatchTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceBatch: Batch | null;
  courseId: string;
  onSuccess: () => void;
}

const BatchTransferModal: React.FC<BatchTransferModalProps> = ({
  isOpen,
  onClose,
  sourceBatch,
  courseId,
  onSuccess,
}) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [targetBatchId, setTargetBatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBatchesAndStudents = async () => {
    try {
      setLoading(true);
      const [batchesRes, studentsRes] = await Promise.all([
        batchAPI.getCourseBatches(courseId),
        enrollmentAPI.getCourseEnrollments(courseId, sourceBatch?._id),
      ]);

      // Filter out source batch from target options
      const availableBatches = batchesRes.data.filter(
        (b: Batch) => b._id !== sourceBatch?._id && b.isActive
      );
      setBatches(availableBatches);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load batches and students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && sourceBatch) {
      fetchBatchesAndStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sourceBatch]);

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.student._id));
    }
  };

  const handleTransfer = async () => {
    if (!targetBatchId || selectedStudents.length === 0) {
      setError("Please select students and target batch");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await batchAPI.transferStudents(
        sourceBatch!._id,
        selectedStudents,
        targetBatchId
      );

      alert(
        `Successfully transferred ${selectedStudents.length} student(s) to the new batch`
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error transferring students:", err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to transfer students");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !sourceBatch) return null;

  const targetBatch = batches.find((b) => b._id === targetBatchId);
  const availableSlots = targetBatch
    ? targetBatch.capacity - targetBatch.enrolledCount
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Transfer Students Between Batches
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Move students from <span className="font-medium">{sourceBatch.name}</span> to another batch
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Target Batch Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Batch
            </label>
            <select
              value={targetBatchId}
              onChange={(e) => setTargetBatchId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select target batch</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name} ({batch.enrolledCount}/{batch.capacity} enrolled
                  - {batch.capacity - batch.enrolledCount} slots available)
                </option>
              ))}
            </select>

            {targetBatchId && selectedStudents.length > 0 && (
              <div className="mt-2 text-sm">
                {availableSlots >= selectedStudents.length ? (
                  <p className="text-green-600">
                    ✓ Target batch has enough capacity ({availableSlots} slots
                    available)
                  </p>
                ) : (
                  <p className="text-red-600">
                    ✗ Not enough capacity. Need {selectedStudents.length} slots but
                    only {availableSlots} available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Student Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">
                Select Students ({selectedStudents.length} of {students.length}{" "}
                selected)
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {selectedStudents.length === students.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading students...
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No students in this batch
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg max-h-80 overflow-y-auto">
                {students.map((enrollment) => (
                  <label
                    key={enrollment.student._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(enrollment.student._id)}
                      onChange={() =>
                        handleStudentToggle(enrollment.student._id)
                      }
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {enrollment.student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {enrollment.student.email}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {enrollment.completionPercentage || 0}% complete
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Transfer Preview */}
          {targetBatchId && selectedStudents.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {sourceBatch.name}
                  </span>
                  <span className="text-blue-700">
                    ({sourceBatch.enrolledCount} students)
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {targetBatch?.name}
                  </span>
                  <span className="text-blue-700">
                    ({(targetBatch?.enrolledCount || 0)} → {(targetBatch?.enrolledCount || 0) + selectedStudents.length} students)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={
              loading ||
              !targetBatchId ||
              selectedStudents.length === 0 ||
              availableSlots < selectedStudents.length
            }
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Transferring...
              </>
            ) : (
              <>Transfer {selectedStudents.length} Student(s)</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchTransferModal;
