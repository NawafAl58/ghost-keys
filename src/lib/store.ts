import { useState, useEffect } from 'react';
import { supabase } from './supabase';

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
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
}

export function useGhostStore() {
  const [games, setGames] = useState<Game[]>([]);
  const [keys, setKeys] = useState<Key[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchStoreData = async () => {
    try {
      // Fetch Games
      const { data: gamesData, error: gamesError } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: true });
      
      if (gamesError) throw gamesError;

      // Fetch Keys
      const { data: keysData, error: keysError } = await supabase
        .from('keys')
        .select('*');
      
      if (keysError) throw keysError;

      // Fetch Orders (Sales)
      const { data: salesData, error: salesError } = await supabase
        .from('orders')
        .select(`
          id,
          game_id,
          key_id,
          price_paid,
          buyer_name,
          buyer_email,
          buyer_phone,
          created_at,
          games (title),
          keys (key_value)
        `)
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      setGames(gamesData.map((g: any) => ({
        id: g.id,
        title: g.title,
        price: g.price,
        platform: g.platform || 'PC',
        image: g.image,
        tag: g.tag || 'جديد',
        perf: g.perf || 'ممتاز',
        status: g.status || 'In Stock'
      })));

      setKeys(keysData.map((k: any) => ({
        id: k.id,
        gameId: k.game_id,
        value: k.key_value,
        isSold: k.is_sold,
        soldAt: k.sold_at
      })));

      setSales(salesData.map((s: any) => ({
        id: s.id,
        gameId: s.game_id,
        gameTitle: s.games?.title || 'Unknown Game',
        price: s.price_paid,
        keyId: s.key_id,
        keyValue: s.keys?.key_value || 'Unknown Key',
        soldAt: s.created_at,
        buyer_name: s.buyer_name,
        buyer_email: s.buyer_email,
        buyer_phone: s.buyer_phone
      })));

      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      setIsLoaded(true); // Still set to loaded to avoid infinite spinner, but could show error UI
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const addKey = async (gameId: number, value: string) => {
    const { data, error } = await supabase
      .from('keys')
      .insert([{ game_id: gameId, key_value: value, is_sold: false }])
      .select();
    
    if (!error && data) {
      setKeys([...keys, { 
        id: data[0].id, 
        gameId: data[0].game_id, 
        value: data[0].key_value, 
        isSold: data[0].is_sold 
      }]);
    }
  };

  const deleteKey = async (keyId: string) => {
    const { error } = await supabase.from('keys').delete().eq('id', keyId);
    if (!error) {
      setKeys(keys.filter(k => k.id !== keyId));
    }
  };

  const sellGame = async (gameId: number, buyerInfo?: { name: string, email: string, phone: string }) => {
    // 1. Get available key
    const { data: availableKeys, error: keyFetchError } = await supabase
      .from('keys')
      .select('*')
      .eq('game_id', gameId)
      .eq('is_sold', false)
      .limit(1);

    if (keyFetchError || !availableKeys || availableKeys.length === 0) return null;
    const key = availableKeys[0];
    const game = games.find(g => g.id === gameId);
    if (!game) return null;

    // 2. Mark key as sold
    const { error: keyUpdateError } = await supabase
      .from('keys')
      .update({ is_sold: true, sold_at: new Date().toISOString() })
      .eq('id', key.id);

    if (keyUpdateError) return null;

    // 3. Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        game_id: gameId,
        key_id: key.id,
        price_paid: game.price,
        buyer_name: buyerInfo?.name || 'Guest',
        buyer_email: buyerInfo?.email || 'N/A',
        buyer_phone: buyerInfo?.phone || 'N/A',
        status: 'completed'
      }])
      .select();

    if (orderError) return null;

    await fetchStoreData(); // Refresh local state
    return key.key_value;
  };

  const updateGame = async (updatedGame: Game) => {
    const { error } = await supabase
      .from('games')
      .update({
        title: updatedGame.title,
        price: updatedGame.price,
        platform: updatedGame.platform,
        image: updatedGame.image,
        tag: updatedGame.tag,
        perf: updatedGame.perf,
        status: updatedGame.status
      })
      .eq('id', updatedGame.id);

    if (!error) {
      setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g));
    }
  };

  const addGame = async (newGame: Omit<Game, 'id'>) => {
    const { data, error } = await supabase
      .from('games')
      .insert([{
        title: newGame.title,
        price: newGame.price,
        platform: newGame.platform,
        image: newGame.image,
        tag: newGame.tag,
        perf: newGame.perf,
        status: newGame.status
      }])
      .select();

    if (!error && data) {
      setGames([...games, { ...newGame, id: data[0].id }]);
    }
  };

  const deleteGame = async (gameId: number) => {
    // Delete keys first due to FK
    await supabase.from('keys').delete().eq('game_id', gameId);
    const { error } = await supabase.from('games').delete().eq('id', gameId);
    
    if (!error) {
      setGames(games.filter(g => g.id !== gameId));
      setKeys(keys.filter(k => k.gameId !== gameId));
    }
  };

  return { games, keys, sales, addKey, deleteKey, sellGame, updateGame, addGame, deleteGame, isLoaded, refresh: fetchStoreData };
}