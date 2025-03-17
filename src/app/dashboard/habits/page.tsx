'use client';

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import axios from 'axios';


import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';


import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import CustomerFormModal from '@/components/dashboard/customer/CustomerFormModal';



import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>(''); // Nuevo estado para búsqueda
  const [page, setPage] = React.useState<number>(0); // Estado para la paginación
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5); // Tamaño de página

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [customerToEdit, setCustomerToEdit] = React.useState<Customer | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState<string | null>(null);



 // Cargar clientes
 const fetchCustomers = async () => {
  setLoading(true);
  try {
    const response = await axios.get('http://localhost:5000/api/customers');
    setCustomers(response.data);
  } catch (err) {
    console.error('Error fetching customers:', err);
    setError('Failed to fetch customers');
  } finally {
    setLoading(false);
  }
};

React.useEffect(() => {
  fetchCustomers();
}, []);

// Agregar cliente
const handleAddCustomer = () => {
  setCustomerToEdit(null);
  setIsModalOpen(true);
};

// Editar cliente
const handleEditCustomer = (customer: Customer) => {
  setCustomerToEdit(customer);
  setIsModalOpen(true);
};

// Solicitar confirmación para eliminar cliente
const handleDeleteCustomerConfirmation = (customerId: string) => {
  setCustomerIdToDelete(customerId);
  setIsDeleteDialogOpen(true);
};

// Eliminar cliente después de confirmar
const handleDeleteCustomer = async () => {
  if (!customerIdToDelete) return;
  try {
    await axios.delete(`http://localhost:5000/api/customers/${customerIdToDelete}`);
    fetchCustomers(); // Actualizar lista después de eliminar
    setIsDeleteDialogOpen(false); // Cerrar diálogo
  } catch (error) {
    console.error('Error deleting customer:', error);
  } finally {
    setCustomerIdToDelete(null);
  }
};

// Cerrar diálogo de confirmación
const handleCloseDeleteDialog = () => {
  setIsDeleteDialogOpen(false);
  setCustomerIdToDelete(null);
};

const handleCustomerAdded = () => {
  fetchCustomers();
};





  // Filtrar clientes según búsqueda
  React.useEffect(() => {
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setPage(0); // Reiniciar a la primera página cuando se aplica un filtro
  }, [searchQuery, customers]);

  // Manejadores para la paginación
  const handlePageChange = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reiniciar a la primera página al cambiar el tamaño de página
  };

  // Manejador para la búsqueda
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };




  

  // Datos paginados
  const paginatedCustomers = filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Stack spacing={3}>
    {/* Título y Botón en una fila */}
    <Stack direction="row" spacing={3} alignItems="center">
      <Typography variant="h4">Important People</Typography>
      <Button
        startIcon={<PlusIcon />}
        variant="contained"
        onClick={() => setIsModalOpen(true)}
      >
        Add
      </Button>
    </Stack>
    
    {/* Tarjeta debajo del botón */}
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          Historic Brands
        </Typography>
        <Typography variant="h5" component="div">
        The most important people in the world can be political leaders, scientists, artists, religious leaders, or businessmen !
        </Typography>
      </CardContent>
    </Card>
      {/* Filtros */}
      <CustomersFilters onSearchChange={handleSearchChange} />
      {/* Tabla */}
      <CustomersTable
        count={filteredCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        //onEdit={setCustomerToEdit}
        onDelete={(id) => console.log('Delete:', id)} // Ejemplo
        onEdit={handleEditCustomer}
        
        onDelete={handleDeleteCustomerConfirmation} // Llama al diálogo de confirmación
      />
      {/* Modal para agregar/editar cliente */}
      <CustomerFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={fetchCustomers}
        customerToEdit={customerToEdit}
      />

      {/* Diálogo de Confirmación para Eliminar */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this character? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteCustomer} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Stack>
  );
}
