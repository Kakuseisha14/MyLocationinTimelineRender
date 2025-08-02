import axios from 'axios';

interface History {
  id: string;
  title: string;
  description: string;
  logo: string;
  installs: number;
  updatedAt: Date;
}

async function fetchHistorys(): Promise<History[]> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/history-events`);
    console.log('Fetched History Events:', response.data); // Imprime los datos recibidos
    const newHistorys = response.data.map((item: any) => ({
      id: item.id.toString(),
      title: item.titulo,
      description: item.fragmento,
      logo: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.img}`, // Ajusta la ruta de la imagen
      installs: Math.floor(Math.random() * 1000),
      updatedAt: new Date(item.fecha),
    }));

    //console.log('Fetched History Events:', newHistorys); // Imprime los datos recibidos

    return newHistorys;
  } catch (error) {
    console.error('Error fetching history events:', error);
    return [];
  }
}

export default fetchHistorys;