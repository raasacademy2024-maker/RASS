import React from 'react';
import { Users, Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Batch {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount: number;
  isActive: boolean;
}

interface BatchSelectorProps {
  batches: Batch[];
  selectedBatchId: string | null;
  onBatchChange: (batchId: string | null) => void;
  showAllOption?: boolean;
  className?: string;
}

const BatchSelector: React.FC<BatchSelectorProps> = ({
  batches,
  selectedBatchId,
  onBatchChange,
  showAllOption = true,
  className = '',
}) => {
  const selectedBatch = batches.find(b => b._id === selectedBatchId);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <Users className="h-4 w-4 text-indigo-600" />
        Select Batch
      </label>
      
      <div className="relative">
        <select
          value={selectedBatchId || 'all'}
          onChange={(e) => onBatchChange(e.target.value === 'all' ? null : e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10 bg-white border-2 border-gray-200 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                   transition-all duration-200 cursor-pointer hover:border-indigo-300
                   font-medium text-gray-900"
        >
          {showAllOption && (
            <option value="all">All Batches</option>
          )}
          {batches.map((batch) => (
            <option key={batch._id} value={batch._id}>
              {batch.name} ({batch.enrolledCount}/{batch.capacity})
              {!batch.isActive && ' - Inactive'}
            </option>
          ))}
        </select>
        
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {selectedBatch && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
        >
          <div className="flex items-center gap-2 text-sm text-indigo-700">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(selectedBatch.startDate).toLocaleDateString()} - {new Date(selectedBatch.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-1 text-xs text-indigo-600">
            {selectedBatch.enrolledCount} / {selectedBatch.capacity} students enrolled
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BatchSelector;
