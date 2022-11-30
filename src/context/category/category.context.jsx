import { createContext, useEffect, useState } from "react";
import {
    deleteListingDocument,
    getCategoryAndDocuments,
    addListingDocument,
    getListing,
} from "../../utils/firebase/firebase.utils";
import { toast } from "react-toastify";


export const CategoryContext = createContext({
    listings: [],
    setListings: () => [],
    addListingItem: () => null,
    deleteListingItemById: () => null,
});

export const fetchCategories = async () => {
    const listings = await getCategoryAndDocuments();
    return listings;
}

export const CategoriesProvider = ({ children }) => {
    const [listings, setListings] = useState([]);

    const addListingItem = async (listing) => {
        const { id } = await addListingDocument(listing);
        const newItems = await fetchCategories();
        setListings(newItems);
        // Or setListings([...listings, listing]);
        toast.success("listing is added");
        return id;
    };
    const deleteListingItemById = async (listingId) => {
        // await deleteListingDocument(listingId);
        await deleteListingDocument(listingId);
        const newItems = await fetchCategories();
        setListings(newItems);
        // Or setListings(listings.filter(listing) => listing.id !== listingId);
    };
    const getListingItem = async (listingId) => await getListing(listingId);


    const value = {
        listings, setListings,
        addListingItem, deleteListingItemById,
        getListingItem,
    };
    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
};