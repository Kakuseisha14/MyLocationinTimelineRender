'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid';

interface HistoryEventFormModalProps {
  open: boolean;
  onClose: () => void;
  onEventAdded: () => void;
  eventToEdit?: HistoryEvent | null;
}

interface HistoryEvent {
  id: number;
  titulo: string;
  affected_personnel: string;
  fecha: string;
  fragmento: string;
  img?: File;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function HistoryEventFormModal({
  open,
  onClose,
  onEventAdded,
  eventToEdit,
}: HistoryEventFormModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    affected_personnel: '',
    fecha: '',
    fragmento: '',
    img: undefined as File | undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        titulo: eventToEdit.titulo,
        affected_personnel: eventToEdit.affected_personnel,
        fecha: eventToEdit.fecha,
        fragmento: eventToEdit.fragmento,
        img: undefined,
      });
    } else {
      setFormData({
        titulo: '',
        affected_personnel: '',
        fecha: '',
        fragmento: '',
        img: undefined,
      });
    }
  }, [eventToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, img: event.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (!formData.titulo || !formData.affected_personnel || !formData.fecha || !formData.fragmento) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    const formPayload = new FormData();
    formPayload.append('titulo', formData.titulo);
    formPayload.append('affected_personnel', formData.affected_personnel);
    formPayload.append('fecha', formData.fecha);
    formPayload.append('fragmento', formData.fragmento);
    if (formData.img) {
      formPayload.append('img', formData.img);
    }

    console.log('Form Data:', {
      titulo: formData.titulo,
      affected_personnel: formData.affected_personnel,
      fecha: formData.fecha,
      fragmento: formData.fragmento,
      img: formData.img ? formData.img.name : 'No Image',
    });

    try {
      if (eventToEdit) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/history-events/${eventToEdit.id}`,
          formPayload,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/history-events`, formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      onEventAdded();
      onClose();
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          {eventToEdit ? 'Edit Historical Event' : 'Add Historical Event'}
        </Typography>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Title"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Affected Personnel"
                name="affected_personnel"
                value={formData.affected_personnel}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Updated Date"
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
          </Grid>

          <TextField
            label="Story Fragment"
            name="fragmento"
            value={formData.fragmento}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                name="img"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {formData.img && (
              <Typography variant="body2">File: {formData.img.name}</Typography>
            )}
          </Stack>

          {error && <Typography color="error">{error}</Typography>}

          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? (eventToEdit ? 'Updating...' : 'Adding...') : eventToEdit ? 'Update Event' : 'Add Event'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}