import { createContext, useState, useReducer } from "react";
import {
    deleteListingDocument,
    getCategoryAndDocuments,
    addListingDocument,
    updateListing,
    getListing,
} from "../../utils/firebase/firebase.utils";
import { createAction } from "../../utils/reducer/reducer.utils";
import { toast } from "react-toastify";

const CATEGORY_ACTION_TYPE = {
    SET_CATEGORIES: "category/SET_CATEGORIES"
}
const CATEGORY_INITIAL_STATE = {
    listings: null
}

export const CategoryReducer = (state, action) => {
    console.log(action);
    const { type, payload } = action;

    switch (type) {
        case CATEGORY_ACTION_TYPE.SET_CATEGORIES:
            return { ...state, listings: payload };
        default:
            throw new Error(`Unhandled type ${type} in CategoryReducer`);
    }
}

export const CategoryContext = createContext({
    listings: [],
    setListings: () => [],

    addListingItem: async (listing) => null,
    getListingItem: async (listingId) => null,
    updateListingItem: async (listingId, listing) => null,
    deleteListingItem: async (listingId) => null,
});


const fetchCategories = async () => {
    const listings = await getCategoryAndDocuments();
    return listings;
}

export const CategoriesProvider = ({ children }) => {
    const [{ listings }, dispatch] = useReducer(CategoryReducer, CATEGORY_INITIAL_STATE);

    const setListings = (state) => dispatch(createAction(CATEGORY_ACTION_TYPE.SET_CATEGORIES, state));

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