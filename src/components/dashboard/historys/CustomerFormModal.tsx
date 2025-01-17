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


interface CustomerFormModalProps {
  open: boolean;
  onClose: () => void;
  onCustomerAdded: () => void;
  customerToEdit?: Customer | null;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
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

export default function CustomerFormModal({
  open,
  onClose,
  onCustomerAdded,
  customerToEdit,
}: CustomerFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reinicia el formulario al abrir el modal
  useEffect(() => {
    if (customerToEdit) {
      // Si hay cliente a editar, carga sus datos en el formulario
      setFormData({
        name: customerToEdit.name,
        email: customerToEdit.email,
        phone: customerToEdit.phone,
        address: customerToEdit.address,
      });
    } else {
      // Si no hay cliente a editar, limpia el formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [customerToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormData({ ...formData, imageName: file.name });
    }
  };
  

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Validación básica para campos requeridos
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      if (customerToEdit) {
        // Editar cliente
        console.log('Editing customer:', formData);
        await axios.put(
          `http://localhost:5000/api/customers/${customerToEdit.id}`,
          formData
        );
      } else {
        // Crear cliente
        console.log('Creating new customer:', formData);
        await axios.post('http://localhost:5000/api/customers', formData);
      }

      onCustomerAdded(); // Actualizar la lista de clientes en el componente padre
      onClose(); // Cerrar el modal
    } catch (err) {
      console.error('Error saving customer:', err);
      setError('Failed to save customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
  <Box sx={modalStyle}>
    <Typography variant="h6" mb={2}>
      {customerToEdit ? 'Edit Customer' : 'Add Historical Event'}
    </Typography>
    <Stack spacing={3}>
      {/* Fila con Título, Personal Afectado y Fecha Actualizada */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Title"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Affected Personnel"
            name="personnel"
            value={formData.personnel}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Updated Date"
            type="date"
            name="updatedDate"
            value={formData.updatedDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }} // Hace que el label no se superponga al valor
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Campo de texto para fragmento de historia */}
      <TextField
        label="Story Fragment"
        name="storyFragment"
        value={formData.storyFragment}
        onChange={handleChange}
        multiline
        rows={4} // Especifica la altura del textarea
        fullWidth
      />

      {/* Botón para subir imagen */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Button variant="contained" component="label">
          Upload Image
          <input
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={handleFileChange} // Evento para manejar la carga de archivos
          />
        </Button>
        {formData.imageName && (
          <Typography variant="body2">File: {formData.imageName}</Typography>
        )}
      </Stack>

      {/* Mostrar error si existe */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Botón de acción (Añadir o Actualizar) */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading
          ? customerToEdit
            ? 'Updating...'
            : 'Adding...'
          : customerToEdit
          ? 'Update Customer'
          : 'Add Event'}
      </Button>
    </Stack>
  </Box>
</Modal>

  );
}
