import React, { useState } from 'react';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { mergeDocuments } from './utils/pdfHelpers';
import { FileDown, Loader2, Files } from 'lucide-react';

function App() {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);

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

    try {
      const fileObjects = files.map(f => f.file);
      const mergedPdfBytes = await mergeDocuments(fileObjects);
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

      // Check if we are in Electron or Browser
      const isElectron = window.process && window.process.type === 'renderer';

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

          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        } catch (err) {
          if (err.name !== 'AbortError') {
            alert("Error saving file.");
          }
        }
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'merged-documents.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error("Merge error:", error);
      alert("Failed to merge documents.");
    } finally {
      setIsMerging(false);
    }
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleMerge}
            disabled={isMerging}
            style={{ minWidth: '240px', padding: '1rem 2rem' }}
          >
            {isMerging ? (
              <>
                <Loader2 className="spin" size={22} style={{ animation: 'spin 1s linear infinite' }} />
                Processing...
              </>
            ) : (
              <>
                <FileDown size={22} />
                Merge all documents
              </>
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;
