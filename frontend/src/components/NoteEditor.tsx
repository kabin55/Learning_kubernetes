import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { type Note, notesService } from '../services/notes.service';

interface NoteEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  note?: Note;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ open, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [note, open]);

  const handleSubmit = async () => {
    if (!title || !content) return;
    setLoading(true);
    try {
      if (note) {
        await notesService.update(note._id, { title, content });
      } else {
        await notesService.create({ title, content });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save note', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{note ? 'Edit Note' : 'Create Note'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Content"
          fullWidth
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !title || !content}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteEditor;
