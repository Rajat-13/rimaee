import { useState, useEffect } from "react";
import { fragranceRepository } from "@/repositories/fragranceRepository";
import { Fragrance } from "@/models/fragrance";

export const useFragrancesViewModel = () => {
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFragrances = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fragranceRepository.list();
      setFragrances(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveFragrance = async (fragrance: Partial<Fragrance>, id?: number) => {
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await fragranceRepository.update(id, fragrance);
      } else {
        await fragranceRepository.create(fragrance);
      }
      await fetchFragrances();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFragrance = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await fragranceRepository.delete(id);
      await fetchFragrances();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFragrances();
  }, []);

  return {
    fragrances,
    loading,
    error,
    fetchFragrances,
    saveFragrance,
    deleteFragrance,
  };
};
