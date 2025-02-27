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

  useEffect(() => {
    fetchHistorys().then((data) => {
      
      setHistorys(data);
    });
  }, []);

  const handleEventAdded = () => {
    // Lógica para actualizar la lista de eventos
    console.log('Evento agregado con éxito');
    setIsModalOpen(false); // Cierra el modal después de agregar el evento
    fetchHistorys().then((data) => setHistorys(data)); // Actualiza la lista de eventos
  };

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
      <CompaniesFilters />
      <Grid container spacing={3}>
        {historys.map((history) => (
          <Grid key={history.id} lg={4} md={6} xs={12}>
            <HistoryCard history={history} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box>
    </Stack>
  );
}