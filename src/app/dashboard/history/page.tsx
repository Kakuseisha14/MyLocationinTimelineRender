"use client";

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';
import { HistoryCard } from '@/components/dashboard/historys/history-card';
import type { History } from '@/components/dashboard/historys/history-card';
import { CompaniesFilters } from '@/components/dashboard/historys/history-filters';
import HistoryFormModal from '@/components/dashboard/historys/HistoryFormModal';
import fetchHistorys from '@/components/dashboard/historys/historyData';

//export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [historys, setHistorys] = useState<History[]>([]);
  const [filteredHistorys, setFilteredHistorys] = useState<History[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);

  useEffect(() => {
    fetchHistorys().then((data) => {
      setHistorys(data);
      setFilteredHistorys(data);
    });
  }, []);

  const handleEventAdded = () => {
    console.log('Evento agregado con éxito');
    setIsModalOpen(false);
    fetchHistorys().then((data) => {
      setHistorys(data);
      setFilteredHistorys(data);
    });
  };

 
  const handleSearch = (searchTerm: string) => {
    const filtered = historys.filter((history) =>
      history.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistorys(filtered);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Calcular los elementos a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistorys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistorys.length / itemsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">History </Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={() => setIsModalOpen(true)}>
            Add
          </Button>
        </div>
        <HistoryFormModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventAdded={handleEventAdded}
        />
      </Stack>
      {/* Filtros */}
  
      <CompaniesFilters onSearch={handleSearch}  />
      <Grid container spacing={3}>
        {filteredHistorys.map((history) => (
          <Grid key={history.id} lg={4} md={6} xs={12}>
            <HistoryCard history={history} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          size="small"
        />
      </Box>
    </Stack>
  );
}