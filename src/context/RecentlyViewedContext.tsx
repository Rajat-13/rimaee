import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface ViewedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  viewedAt: string;
}

interface RecentlyViewedContextType {
  items: ViewedProduct[];
  addViewedProduct: (product: Omit<ViewedProduct, 'viewedAt'>) => void;
  clearHistory: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_ITEMS = 20;

export const RecentlyViewedProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ViewedProduct[]>(() => {
    const saved = localStorage.getItem("rimae_recently_viewed");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("rimae_recently_viewed", JSON.stringify(items));
  }, [items]);

  const addViewedProduct = (product: Omit<ViewedProduct, 'viewedAt'>) => {
    setItems((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      
      // Add to beginning with timestamp
      const newItem: ViewedProduct = {
        ...product,
        viewedAt: new Date().toISOString(),
      };
      
      // Keep only last MAX_ITEMS
      return [newItem, ...filtered].slice(0, MAX_ITEMS);
    });
  };

  const clearHistory = () => {
    setItems([]);
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        items,
        addViewedProduct,
        clearHistory,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within a RecentlyViewedProvider");
  }
  return context;
};
