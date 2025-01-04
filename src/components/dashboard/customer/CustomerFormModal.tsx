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
  width: 400,
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
          {customerToEdit ? 'Edit Customer' : 'Add New Customer'}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
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
              : 'Add Customer'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
