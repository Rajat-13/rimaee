import { useState, useEffect } from "react";
import { accessoryRepository } from "@/repositories/accessoryRepository";
import { Accessory } from "@/models/accessory";

export const useAccessoriesViewModel = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accessoryRepository.list();
      setAccessories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveAccessory = async (accessory: Partial<Accessory>, id?: number) => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await accessoryRepository.update(id, accessory);
      } else {
        await accessoryRepository.create(accessory);
      }
      await fetchAccessories();
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccessory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await accessoryRepository.delete(id);
      await fetchAccessories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  return {
    accessories,
    loading,
    error,
    fetchAccessories,
    saveAccessory,
    deleteAccessory,
  };
};
