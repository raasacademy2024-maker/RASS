import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { InstructorSelector } from './InstructorSelector';
import { BatchScheduleForm } from './BatchScheduleForm';
import { BatchFeesForm } from './BatchFeesForm';
import { Batch } from '../../types';

interface BatchFormData {
  courseId: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  description: string;
  isActive: boolean;
  instructors: string[];
  fees: {
    amount?: number;
    currency?: string;
    installments?: {
      amount: number;
      dueDate: string;
      description: string;
    }[];
  };
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
    timezone: string;
  };
}

interface EnhancedBatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BatchFormData) => Promise<void>;
  editingBatch: Batch | null;
  courseId: string;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400";

export const EnhancedBatchFormModal: React.FC<EnhancedBatchFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingBatch,
  courseId,
}) => {
  const [formData, setFormData] = useState<BatchFormData>({
    courseId: courseId,
    name: '',
    startDate: '',
    endDate: '',
    capacity: 30,
    description: '',
    isActive: true,
    instructors: [],
    fees: {
      amount: 0,
      currency: 'INR',
      installments: []
    },
    schedule: {
      days: [],
      startTime: '',
      endTime: '',
      timezone: 'Asia/Kolkata'
    }
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'instructors' | 'fees' | 'schedule'>('basic');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingBatch) {
      setFormData({
        courseId: typeof editingBatch.course === 'string' ? editingBatch.course : editingBatch.course._id,
        name: editingBatch.name,
        startDate: editingBatch.startDate.split('T')[0],
        endDate: editingBatch.endDate.split('T')[0],
        capacity: editingBatch.capacity,
        description: editingBatch.description || '',
        isActive: editingBatch.isActive,
        instructors: editingBatch.instructors?.map(i => typeof i === 'string' ? i : i._id) || [],
        fees: editingBatch.fees || { amount: 0, currency: 'INR', installments: [] },
        schedule: editingBatch.schedule || { days: [], startTime: '', endTime: '', timezone: 'Asia/Kolkata' }
      });
    } else {
      setFormData({
        courseId: courseId,
        name: '',
        startDate: '',
        endDate: '',
        capacity: 30,
        description: '',
        isActive: true,
        instructors: [],
        fees: {
          amount: 0,
          currency: 'INR',
          installments: []
        },
        schedule: {
          days: [],
          startTime: '',
          endTime: '',
          timezone: 'Asia/Kolkata'
        }
      });
      setActiveTab('basic');
    }
  }, [editingBatch, courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'instructors', label: 'Instructors' },
    { id: 'fees', label: 'Fees' },
    { id: 'schedule', label: 'Schedule' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingBatch ? 'Edit Batch' : 'Create New Batch'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50 px-6">
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., January 2025 Batch"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional batch description"
                    rows={3}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Batch is active
                  </label>
                </div>
              </div>
            )}

            {/* Instructors Tab */}
            {activeTab === 'instructors' && (
              <InstructorSelector
                selectedInstructors={formData.instructors}
                onChange={(instructors) => setFormData({ ...formData, instructors })}
              />
            )}

            {/* Fees Tab */}
            {activeTab === 'fees' && (
              <BatchFeesForm
                fees={formData.fees}
                onChange={(fees) => setFormData({ ...formData, fees })}
              />
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <BatchScheduleForm
                schedule={formData.schedule}
                onChange={(schedule) => setFormData({ ...formData, schedule })}
              />
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {submitting ? 'Saving...' : editingBatch ? 'Update Batch' : 'Create Batch'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
