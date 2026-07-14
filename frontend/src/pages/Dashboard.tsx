import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { notesService, type Note } from '../services/notes.service';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const fetchNotes = async () => {
    try {
      const data = await notesService.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = () => {
    setEditingNote(undefined);
    setEditorOpen(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesService.delete(id);
        fetchNotes();
      } catch (error) {
        console.error('Failed to delete note', error);
      }
    }
  };

  const filteredNotes = useMemo(() => {
    if (!search) return notes;
    return notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));
  }, [notes, search]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          New Note
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <NotesList notes={filteredNotes} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <NoteEditor 
        open={editorOpen} 
        onClose={() => setEditorOpen(false)} 
        onSave={fetchNotes}
        note={editingNote}
      />
    </Box>
  );
};

export default Dashboard;
