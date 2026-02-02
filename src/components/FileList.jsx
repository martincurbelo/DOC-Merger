import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X, FileText, Image as ImageIcon, GripVertical } from 'lucide-react';

// Portal component for dragging items
const PortalAwareItem = ({ provided, snapshot, children }) => {
  const usePortal = snapshot.isDragging;

  const child = (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`file-item ${snapshot.isDragging ? 'dragging' : ''}`}
    >
      {children}
    </div>
  );

  if (!usePortal) {
    return child;
  }

  // Render in portal when dragging
  return ReactDOM.createPortal(child, document.body);
};

export function FileList({ files, onRemove, onReorder }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  if (files.length === 0) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="files">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="file-list"
          >
            {files.map((fileObj, index) => (
              <Draggable key={fileObj.id} draggableId={fileObj.id} index={index}>
                {(provided, snapshot) => (
                  <PortalAwareItem provided={provided} snapshot={snapshot}>
                    <div className="file-item-left">
                      <div className="drag-handle">
                        <GripVertical size={20} />
                      </div>
                      <div className="file-icon">
                        {fileObj.file.type === 'application/pdf' ? (
                          <FileText size={20} color="#ef4444" />
                        ) : (
                          <ImageIcon size={20} color="#10b981" />
                        )}
                      </div>
                      <div className="file-info">
                        <span className="file-name">{fileObj.file.name}</span>
                        <span className="file-size">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(fileObj.id);
                      }}
                    >
                      <X size={18} />
                    </button>
                  </PortalAwareItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            <style>{`
              .file-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-bottom: 2rem;
                max-height: 300px;
                overflow-y: auto;
                padding: 0.5rem;
              }
              .file-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: white;
                padding: 1rem;
                border-radius: 12px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                border: 1px solid #f1f5f9;
                user-select: none;
                cursor: grab;
              }
              .file-item:active {
                cursor: grabbing;
              }
              .file-item.dragging {
                box-shadow: 0 15px 30px rgba(0,0,0,0.2);
                background: white;
                z-index: 9999;
              }
              .file-item-left {
                display: flex;
                align-items: center;
                gap: 1rem;
              }
              .drag-handle {
                color: #cbd5e1;
                display: flex;
                align-items: center;
                padding: 4px;
              }
              .file-icon {
                display: flex;
                align-items: center;
              }
              .file-info {
                display: flex;
                flex-direction: column;
              }
              .file-name {
                font-weight: 500;
                font-size: 0.95rem;
                max-width: 250px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #0f172a;
              }
              .file-size {
                font-size: 0.8rem;
                color: #64748b;
              }
              .remove-btn {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: color 0.2s, background 0.2s;
              }
              .remove-btn:hover {
                color: #ef4444;
                background: #fef2f2;
              }
            `}</style>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
