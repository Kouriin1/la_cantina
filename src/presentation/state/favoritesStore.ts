import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product } from '../../domain/entities/Product';

interface FavoritesStore {
    favorites: Product[];
    addFavorite: (product: Product) => void;
    removeFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (product: Product) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            favorites: [],

            addFavorite: (product: Product) => {
                const favorites = get().favorites;
                if (!favorites.find(p => p.id === product.id)) {
                    set({ favorites: [...favorites, product] });
                }
            },

            removeFavorite: (productId: string) => {
                set({ favorites: get().favorites.filter(p => p.id !== productId) });
            },

            isFavorite: (productId: string) => {
                return !!get().favorites.find(p => p.id === productId);
            },

            toggleFavorite: (product: Product) => {
                const isFav = get().isFavorite(product.id);
                if (isFav) {
                    get().removeFavorite(product.id);
                } else {
                    get().addFavorite(product);
                }
            }
        }),
        {
            name: 'favorites-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
