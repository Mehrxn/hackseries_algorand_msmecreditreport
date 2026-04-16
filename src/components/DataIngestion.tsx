import React, { useCallback, useState } from 'react';
import { calculateCreditScore, FinancialData, ScoringResult } from '../utils/scoring';

interface DataIngestionProps {
  onScoreCalculated: (result: ScoringResult) => void;
}

export const DataIngestion: React.FC<DataIngestionProps> = ({ onScoreCalculated }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const parseFinancialData = (jsonData: any): FinancialData => {
    // Validate required fields
    if (!jsonData.monthlyIncome || !Array.isArray(jsonData.monthlyIncome)) {
      throw new Error('Missing or invalid monthlyIncome array');
    }
    if (!jsonData.monthlyExpenses || !Array.isArray(jsonData.monthlyExpenses)) {
      throw new Error('Missing or invalid monthlyExpenses array');
    }
    if (typeof jsonData.transactionCount !== 'number') {
      throw new Error('Missing or invalid transactionCount');
    }
    if (typeof jsonData.gstFiledMonths !== 'number' || typeof jsonData.gstTotalMonths !== 'number') {
      throw new Error('Missing or invalid GST data');
    }
    if (typeof jsonData.cashBalance !== 'number') {
      throw new Error('Missing or invalid cashBalance');
    }

    return {
      monthlyIncome: jsonData.monthlyIncome,
      monthlyExpenses: jsonData.monthlyExpenses,
      transactionCount: jsonData.transactionCount,
      gstFiledMonths: jsonData.gstFiledMonths,
      gstTotalMonths: jsonData.gstTotalMonths,
      cashBalance: jsonData.cashBalance,
      avgMonthlyIncome:
        jsonData.monthlyIncome.reduce((a: number, b: number) => a + b, 0) / jsonData.monthlyIncome.length,
    };
  };

  const handleFile = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError('');

      try {
        const text = await file.text();
        const jsonData = JSON.parse(text);

        // Validate and parse
        const financialData = parseFinancialData(jsonData);

        // Calculate score
        const result = calculateCreditScore(financialData);
        onScoreCalculated(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to process file. Please check the JSON format.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onScoreCalculated]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V12a4 4 0 00-4-4H28z"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <label className="block">
            <span className="text-lg font-semibold text-gray-700">
              {isLoading ? 'Processing...' : 'Drop your MSME data file here'}
            </span>
            <span className="block text-sm text-gray-500 mt-2">or click to browse</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileInput}
              disabled={isLoading}
              className="hidden"
            />
          </label>

          <p className="text-xs text-gray-500 mt-4">JSON file with financial data</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-semibold">Error:</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default DataIngestion;
