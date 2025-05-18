'use client';

import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import axios from 'axios';


import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';


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
        <Typography variant="h4">Habit management</Typography>
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
            Good Habits
          </Typography>
          <Typography variant="h5" component="div">
            Having good habits in life is key to success, health, and overall well-being. Habits, whether positive or negative, shape our daily routine and largely determine the quality of life we ​​lead.
          </Typography>
        </CardContent>
      </Card>

      <CustomersFilters onSearchChange={handleSearchChange} />
  
      {/* ImageList con Title Bars */}
      <ImageList sx={{ width: '100%', height: 450 }} cols={3}>
        <ImageListItem key="Subheader" cols={3}>
          <ListSubheader component="div">HABITS</ListSubheader>
        </ImageListItem>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=248&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.title}
              subtitle={item.author}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.title}`}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
  
      
  
      {/* Resto de tu código (filtros, tabla, modales, etc.) */}
   
   
      <CustomerFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={fetchCustomers}
        customerToEdit={customerToEdit}
      />
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

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Veccit',
    author: '@bkristastucchio',
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
    author: '@tjdragotta',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
    author: '@katie_wasserman',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    author: '@silverdalex',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
    author: '@shelleypauls',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
    author: '@peterlaster',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    author: '@southside_customs',
    cols: 2,
  },
];


