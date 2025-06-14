import React, { useState } from 'react';

const DataExport = ({ goals, exchangeRate, onImportData }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const exportAsJSON = () => {
    const exportData = {
      goals,
      exchangeRate,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `syfe-savings-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportMenu(false);
  };

  const exportAsCSV = () => {
    let csvContent = 'Goal Name,Target Amount,Currency,Saved Amount,Progress %,Created Date,Contributions Count\n';
    
    goals.forEach(goal => {
      const progress = ((goal.saved / goal.target) * 100).toFixed(2);
      const createdDate = new Date(goal.createdAt).toLocaleDateString();
      const contributionsCount = goal.contributions?.length || 0;
      
      csvContent += `"${goal.name}",${goal.target},${goal.currency},${goal.saved},${progress}%,${createdDate},${contributionsCount}\n`;
    });

    csvContent += '\n\nDetailed Contributions:\n';
    csvContent += 'Goal Name,Contribution Amount,Date,Notes\n';
    
    goals.forEach(goal => {
      if (goal.contributions && goal.contributions.length > 0) {
        goal.contributions.forEach(contribution => {
          const date = new Date(contribution.date).toLocaleDateString();
          const notes = contribution.notes || '';
          csvContent += `"${goal.name}",${contribution.amount},${date},"${notes}"\n`;
        });
      }
    });

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `syfe-savings-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowExportMenu(false);
  };

  const generatePDFReport = () => {
    const totalTarget = goals.reduce((sum, goal) => {
      const targetInINR = goal.currency === 'USD' ? goal.target * (exchangeRate || 83.5) : goal.target;
      return sum + targetInINR;
    }, 0);

    const totalSaved = goals.reduce((sum, goal) => {
      const savedInINR = goal.currency === 'USD' ? goal.saved * (exchangeRate || 83.5) : goal.saved;
      return sum + savedInINR;
    }, 0);

    const overallProgress = totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(1) : 0;

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Syfe Savings Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
          .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .goals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
          .goal-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
          .progress-bar { width: 100%; height: 20px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
          .progress-fill { height: 100%; background: linear-gradient(to right, #3b82f6, #10b981); }
          .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💰 Syfe Savings Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Total Goals:</strong> ${goals.length}</p>
          <p><strong>Total Target:</strong> ₹${totalTarget.toLocaleString()}</p>
          <p><strong>Total Saved:</strong> ₹${totalSaved.toLocaleString()}</p>
          <p><strong>Overall Progress:</strong> ${overallProgress}%</p>
        </div>
        
        <h2>Goals Details</h2>
        <div class="goals-grid">
          ${goals.map(goal => {
            const progress = ((goal.saved / goal.target) * 100).toFixed(1);
            const targetDisplay = goal.currency === 'USD' ? `${goal.target.toLocaleString()}` : `₹${goal.target.toLocaleString()}`;
            const savedDisplay = goal.currency === 'USD' ? `${goal.saved.toLocaleString()}` : `₹${goal.saved.toLocaleString()}`;
            
            return `
              <div class="goal-card">
                <h3>${goal.name}</h3>
                <p><strong>Target:</strong> ${targetDisplay}</p>
                <p><strong>Saved:</strong> ${savedDisplay}</p>
                <p><strong>Progress:</strong> ${progress}%</p>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                </div>
                <p><strong>Contributions:</strong> ${goal.contributions?.length || 0}</p>
                <p><strong>Created:</strong> ${new Date(goal.createdAt).toLocaleDateString()}</p>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="footer">
          <p>Generated by Syfe Savings Planner | Exchange Rate: 1 USD = ₹${exchangeRate || 83.5}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();
    
    setShowExportMenu(false);
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (!importedData.goals || !Array.isArray(importedData.goals)) {
          throw new Error('Invalid file format: goals array not found');
        }

        const requiredFields = ['name', 'target', 'currency', 'saved'];
        importedData.goals.forEach((goal, index) => {
          requiredFields.forEach(field => {
            if (!(field in goal)) {
              throw new Error(`Invalid goal at index ${index}: missing ${field}`);
            }
          });
        });

        onImportData(importedData);
        setImportSuccess(true);
        setImportError(null);
        
        setTimeout(() => setImportSuccess(false), 3000);
        
      } catch (error) {
        setImportError(`Import failed: ${error.message}`);
        setImportSuccess(false);
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all your savings data? This action cannot be undone.')) {
      localStorage.clear();
      onImportData({ goals: [], exchangeRate: null });
      setShowExportMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
      >
        <span className="mr-2">📊</span>
        Data & Export
      </button>

      {showExportMenu && (
        <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-40 min-w-64">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Export Options</h3>
            <p className="text-sm text-gray-600">Backup your savings data</p>
          </div>
          
          <div className="p-2">
            <button
              onClick={exportAsJSON}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center"
            >
              <span className="mr-3">💾</span>
              <div>
                <div className="font-medium">Export as JSON</div>
                <div className="text-sm text-gray-500">Full backup with all data</div>
              </div>
            </button>

            <button
              onClick={exportAsCSV}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center"
            >
              <span className="mr-3">📈</span>
              <div>
                <div className="font-medium">Export as CSV</div>
                <div className="text-sm text-gray-500">Spreadsheet format</div>
              </div>
            </button>

            <button
              onClick={generatePDFReport}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg flex items-center"
            >
              <span className="mr-3">📄</span>
              <div>
                <div className="font-medium">Generate Report</div>
                <div className="text-sm text-gray-500">Printable PDF report</div>
              </div>
            </button>

            <div className="border-t border-gray-100 my-2"></div>

            <div className="px-4 py-2">
              <div className="font-medium mb-2">Import Data</div>
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
                <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center cursor-pointer hover:bg-blue-100">
                  <span className="text-blue-600">📁 Choose JSON file to import</span>
                </div>
              </label>
            </div>

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={clearAllData}
              className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg flex items-center text-red-600"
            >
              <span className="mr-3">🗑️</span>
              <div>
                <div className="font-medium">Clear All Data</div>
                <div className="text-sm text-red-400">Permanently delete everything</div>
              </div>
            </button>
          </div>

          <div className="p-2 border-t border-gray-100">
            <button
              onClick={() => setShowExportMenu(false)}
              className="w-full text-center py-2 text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {importSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg z-50">
          <span className="block sm:inline">✅ Data imported successfully!</span>
        </div>
      )}

      {importError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50">
          <span className="block sm:inline">{importError}</span>
          <button
            onClick={() => setImportError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {showExportMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
};

export default DataExport;