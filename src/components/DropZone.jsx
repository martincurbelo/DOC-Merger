import React, { useState } from 'react';
import { Upload, FileType } from 'lucide-react';

export function DropZone({ onFilesAdded }) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        onFilesAdded(files);
    };

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files);
        onFilesAdded(files);
    };

    return (
        <div
            className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
        >
            <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                style={{ display: 'none' }}
            />
            <div className="dropzone-content">
                <div className="icon-wrapper">
                    <Upload size={32} />
                </div>
                <h3>Drop your documents here</h3>
                <p>Supports PDF, JPG, and PNG files</p>
            </div>

            <style>{`
        .dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          cursor: pointer;
          transition: var(--transition);
          background: rgba(255, 255, 255, 0.4);
          margin-bottom: 2rem;
        }
        .dropzone:hover, .dropzone.drag-over {
          border-color: var(--primary);
          background: rgba(37, 99, 235, 0.05);
          transform: scale(1.01);
        }
        .icon-wrapper {
          color: var(--primary);
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }
        .dropzone h3 {
          margin-bottom: 0.5rem;
          color: var(--text-main);
        }
        .dropzone p {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
      `}</style>
        </div>
    );
}
