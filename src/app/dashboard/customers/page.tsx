'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import axios from 'axios';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import CustomerFormModal from '@/components/dashboard/customer/CustomerFormModal';

export default function Page(): React.JSX.Element {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [customerToEdit, setCustomerToEdit] = React.useState<Customer | null>(
    null
  );

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

  const handleAddCustomer = () => {
    setCustomerToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsModalOpen(true);
  };

  const handleCustomerAdded = () => {
    fetchCustomers();
  };

  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Typography variant="h4">Customers</Typography>
        <Button
          startIcon={<PlusIcon />}
          variant="contained"
          onClick={handleAddCustomer}
        >
          Add
        </Button>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        onEdit={handleEditCustomer}
      />
      <CustomerFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
        customerToEdit={customerToEdit}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
