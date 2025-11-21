import React from 'react';
import { DollarSign, Plus, Trash2 } from 'lucide-react';

interface FeesConfig {
  amount?: number;
  currency?: string;
  installments?: {
    amount: number;
    dueDate: string;
    description: string;
  }[];
}

interface BatchFeesFormProps {
  fees: FeesConfig;
  onChange: (fees: FeesConfig) => void;
}

export const BatchFeesForm: React.FC<BatchFeesFormProps> = ({
  fees,
  onChange
}) => {
  const addInstallment = () => {
    const newInstallments = [
      ...(fees.installments || []),
      { amount: 0, dueDate: '', description: '' }
    ];
    onChange({ ...fees, installments: newInstallments });
  };

  const removeInstallment = (index: number) => {
    const newInstallments = fees.installments?.filter((_, i) => i !== index);
    onChange({ ...fees, installments: newInstallments });
  };

  const updateInstallment = (index: number, field: string, value: any) => {
    const newInstallments = fees.installments?.map((inst, i) => 
      i === index ? { ...inst, [field]: value } : inst
    );
    onChange({ ...fees, installments: newInstallments });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        <DollarSign className="w-4 h-4 inline mr-2" />
        Batch Fees
      </label>

      {/* Total Amount */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Total Amount
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={fees.amount || ''}
            onChange={(e) => onChange({ ...fees, amount: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Currency
          </label>
          <select
            value={fees.currency || 'INR'}
            onChange={(e) => onChange({ ...fees, currency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>

      {/* Installments Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-600">
            Payment Installments (Optional)
          </label>
          <button
            type="button"
            onClick={addInstallment}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Installment
          </button>
        </div>

        {fees.installments && fees.installments.length > 0 && (
          <div className="space-y-3 border border-gray-200 rounded-lg p-3">
            {fees.installments.map((installment, index) => (
              <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={installment.amount || ''}
                      onChange={(e) => updateInstallment(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={installment.dueDate || ''}
                      onChange={(e) => updateInstallment(index, 'dueDate', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={installment.description || ''}
                      onChange={(e) => updateInstallment(index, 'description', e.target.value)}
                      placeholder="e.g., First payment"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeInstallment(index)}
                  className="mt-6 text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fees Summary */}
      {fees.amount && fees.amount > 0 && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-900 font-medium">
            Total Fees: {fees.currency || 'INR'} {fees.amount.toFixed(2)}
          </p>
          {fees.installments && fees.installments.length > 0 && (
            <p className="text-xs text-green-700 mt-1">
              {fees.installments.length} installment(s) configured
            </p>
          )}
        </div>
      )}
    </div>
  );
};
