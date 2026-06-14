import { useState, useEffect } from 'react';

export interface Game {
  id: number;
  title: string;
  price: number;
  platform: string;
  image: string;
  tag: string;
  perf: string;
  status: 'In Stock' | 'Out of Stock';
}

export interface Key {
  id: string;
  gameId: number;
  value: string;
  isSold: boolean;
  soldAt?: string;
}

export interface Sale {
  id: string;
  gameId: number;
  gameTitle: string;
  price: number;
  keyId: string;
  keyValue: string;
  soldAt: string;
}

const INITIAL_GAMES: Game[] = [
  {
    id: 1,
    title: "Call of Duty: Black Ops 6",
    price: 299,
    platform: "Battle.net",
    image: "https://images.unsplash.com/photo-1614010224047-ff709b0bc3d0?w=800&q=80",
    tag: "الأكثر مبيعاً",
    perf: "ممتاز",
    status: 'In Stock'
  },
  {
    id: 2,
    title: "Elden Ring: Shadow of the Erdtree",
    price: 189,
    platform: "Steam",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80",
    tag: "تقييم عالي",
    perf: "أداء خرافي",
    status: 'In Stock'
  },
  {
    id: 3,
    title: "Cyberpunk 2077: Ultimate Edition",
    price: 145,
    platform: "GOG / Steam",
    image: "https://images.unsplash.com/photo-1605898960710-9ec87b46927a?w=800&q=80",
    tag: "أفضل قيمة",
    perf: "يحتاج كرت قوي",
    status: 'In Stock'
  },
  {
    id: 4,
    title: "Grand Theft Auto V: Premium Edition",
    price: 55,
    platform: "Rockstar / Epic",
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&q=80",
    tag: "صفقة اليوم",
    perf: "يشتغل على أي شي",
    status: 'In Stock'
  }
];

const INITIAL_KEYS: Key[] = [
  { id: 'k1', gameId: 1, value: 'GK-COD-6-BO-XXXX-1', isSold: false },
  { id: 'k2', gameId: 1, value: 'GK-COD-6-BO-XXXX-2', isSold: false },
  { id: 'k3', gameId: 2, value: 'GK-ELDEN-SOT-XXXX-1', isSold: false },
  { id: 'k4', gameId: 3, value: 'GK-CP2077-UE-XXXX-1', isSold: false },
  { id: 'k5', gameId: 4, value: 'GK-GTAV-PREM-XXXX-1', isSold: false },
];

export function useGhostStore() {
  const [games, setGames] = useState<Game[]>([]);
  const [keys, setKeys] = useState<Key[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedGames = localStorage.getItem('ghost_games');
    const savedKeys = localStorage.getItem('ghost_keys');
    const savedSales = localStorage.getItem('ghost_sales');

    setGames(savedGames ? JSON.parse(savedGames) : INITIAL_GAMES);
    setKeys(savedKeys ? JSON.parse(savedKeys) : INITIAL_KEYS);
    setSales(savedSales ? JSON.parse(savedSales) : []);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ghost_games', JSON.stringify(games));
      localStorage.setItem('ghost_keys', JSON.stringify(keys));
      localStorage.setItem('ghost_sales', JSON.stringify(sales));
    }
  }, [games, keys, sales, isLoaded]);

  const addKey = (gameId: number, value: string) => {
    const newKey: Key = { id: Math.random().toString(36).substr(2, 9), gameId, value, isSold: false };
    setKeys([...keys, newKey]);
  };

  const deleteKey = (keyId: string) => {
    setKeys(keys.filter(k => k.id !== keyId));
  };

  const sellGame = (gameId: number) => {
    const availableKeyIndex = keys.findIndex(k => k.gameId === gameId && !k.isSold);
    if (availableKeyIndex === -1) return null;

    const game = games.find(g => g.id === gameId);
    if (!game) return null;

    const key = keys[availableKeyIndex];
    const newKeys = [...keys];
    newKeys[availableKeyIndex] = { ...key, isSold: true, soldAt: new Date().toISOString() };
    
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      gameId,
      gameTitle: game.title,
      price: game.price,
      keyId: key.id,
      keyValue: key.value,
      soldAt: new Date().toISOString()
    };

    setKeys(newKeys);
    setSales([newSale, ...sales]);
    return key.value;
  };

  const updateGame = (updatedGame: Game) => {
    setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g));
  };

  const addGame = (newGame: Omit<Game, 'id'>) => {
    const id = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1;
    setGames([...games, { ...newGame, id }]);
  };

  const deleteGame = (gameId: number) => {
    setGames(games.filter(g => g.id !== gameId));
    setKeys(keys.filter(k => k.gameId !== gameId));
  };

  return { games, keys, sales, addKey, deleteKey, sellGame, updateGame, addGame, deleteGame, isLoaded };
}