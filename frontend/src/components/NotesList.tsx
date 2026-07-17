import React from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import type { Note } from '../services/notes.service';

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onEdit, onDelete }) => {
  if (notes.length === 0) {
    return <Typography color="text.secondary" align="center">No notes found. Create one!</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {notes.map((note) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={note._id}>
          <Card className="glass-panel transition-all" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2" noWrap>
                {note.title}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary" variant="caption">
                {new Date(note.createdAt).toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {note.content}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => onEdit(note)}>Edit</Button>
              <Button size="small" color="error" onClick={() => onDelete(note._id)}>Delete</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default NotesList;
