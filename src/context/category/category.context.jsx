import { createContext, useEffect, useState } from "react";
import {
    deleteListingDocument,
    getCategoryAndDocuments,
    addListingDocument,
    updateListing,
    getListing,
} from "../../utils/firebase/firebase.utils";
import { toast } from "react-toastify";


export const CategoryContext = createContext({
    listings: [],
    setListings: () => [],

    addListingItem: async (listing) => null,
    getListingItem: async (listingId) => null,
    updateListingItem: async (listingId, listing) => null,
    deleteListingItem: async (listingId) => null,
});

export const fetchCategories = async () => {
    const listings = await getCategoryAndDocuments();
    return listings;
}

export const CategoriesProvider = ({ children }) => {
    const [listings, setListings] = useState([]);

    const addListingItem = async (listing) => {
        try {
            const { id } = await addListingDocument(listing);
            const newItems = await fetchCategories();
            setListings(newItems);
            toast.success("listing is added");
            return id;
        } catch (error) {
            toast.error(error);
            return;
        }
    };
    const deleteListingItem = async (listingId) => {
        await deleteListingDocument(listingId);
        // await deleteStoreImages(imageUrls);

        const newItems = await fetchCategories();
        setListings(newItems);
        // Or setListings(listings.filter(listing) => listing.id !== listingId);
    };
    const getListingItem = async (listingId) => await getListing(listingId);

    const updateListingItem = async (listingId, newData) => {
        try {
            await updateListing(listingId, newData);
            toast.success("Listing was edited");
        } catch (error) {
            console.log(error);   
            toast.error("Error happened");         
        }
    }

    const value = {
        listings,
        setListings,
        getListingItem,
        addListingItem,
        updateListingItem,
        deleteListingItem,
    };
    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
};