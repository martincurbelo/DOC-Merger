import React, { useState } from 'react';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { mergeDocuments } from './utils/pdfHelpers';
import { FileDown, Loader2, Files } from 'lucide-react';

function App() {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesAdded = (newFiles) => {
    const currentFilesSet = new Set(files.map(f => `${f.file.name}-${f.file.size}-${f.file.lastModified}`));

    const newFileObjects = newFiles
      .filter(f => !currentFilesSet.has(`${f.name}-${f.size}-${f.lastModified}`))
      .map(f => ({
        id: crypto.randomUUID(),
        file: f
      }));

    setFiles(prev => [...prev, ...newFileObjects]);
  };

  const handleRemove = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleReorder = (newOrder) => {
    setFiles(newOrder);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsMerging(true);
    setProgress(0);

    try {
      const fileObjects = files.map(f => f.file);

      // Merge with progress callback
      const mergedPdfBytes = await mergeDocuments(fileObjects, (p) => setProgress(p));

      // Create blob from the merged PDF
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

      // Try modern File System Access API first
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: 'merged-documents.pdf',
            types: [{
              description: 'PDF Document',
              accept: { 'application/pdf': ['.pdf'] },
            }],
          });

          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();

          // Open the saved file
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');

          // Clean up after a delay
          setTimeout(() => URL.revokeObjectURL(url), 10000);

        } catch (err) {
          if (err.name === 'AbortError') {
            // User cancelled - not an error
            return;
          }
          console.error('Save picker error:', err);
          // Fall back to download method
          downloadBlob(blob);
        }
      } else {
        // Fallback for browsers without showSaveFilePicker
        downloadBlob(blob);
      }
    } catch (error) {
      console.error("Merge error:", error);
      alert(`Failed to merge documents: ${error.message}`);
    } finally {
      setIsMerging(false);
      setProgress(0);
    }
  };

  // Helper function for fallback download
  const downloadBlob = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged-documents.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open in new tab
    window.open(url, '_blank');

    // Clean up after a delay
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="glass-card animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <div style={{
          background: 'white',
          padding: '1rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          color: 'var(--primary)'
        }}>
          <Files size={40} />
        </div>
      </div>

      <h1>DOC Merger</h1>
      <p className="subtitle">Combine PDFs and images into a single, clean document.</p>

      <DropZone onFilesAdded={handleFilesAdded} />

      <FileList
        files={files}
        onRemove={handleRemove}
        onReorder={handleReorder}
      />

      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', gap: '0.75rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleMerge}
            disabled={isMerging}
            style={{ minWidth: '240px', padding: '1rem 2rem' }}
          >
            {isMerging ? (
              <>
                <Loader2 className="spin" size={22} style={{ animation: 'spin 1s linear infinite' }} />
                {progress > 0 ? `Processing... ${progress}%` : 'Starting...'}
              </>
            ) : (
              <>
                <FileDown size={22} />
                Merge {files.length} document{files.length > 1 ? 's' : ''}
              </>
            )}
          </button>

          {isMerging && progress > 0 && (
            <div style={{ width: '240px', height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--primary)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
