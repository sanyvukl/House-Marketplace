import { createContext, useEffect, useState } from "react";
import { deleteListingDocument, getCategoryAndDocuments, addListingDocument } from "../../utils/firebase/firebase.utils";
import { toast } from "react-toastify";

export const CategoryContext = createContext({
    categories: [],
    setCategories: () => [],
    listings: [],
    setListings: () => [],
});
const HOUSES_DATA = [
    {
        bathrooms: 2,
        bedrooms: 2,
        discountedPrice: 2200,
        furnished: true,
        geolocation: { lng: '-73.150530', lat: '41.205590' },
        imageUrls: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60", "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60"
        ],
        location: "8601 West Peachtree St Stratford, CT 06614",
        name: "Beautiful",
        offer: true,
        parking: true,
        regularPrice: 2500,
        timestamp: { seconds: 1669068990, nanoseconds: 974000000 },
        type: "rent",
        userRef: "dQyJ1c0f5wgJ0kZfDzIr8EpsMrC3",
    },
    {
        bathrooms: 2,
        bedrooms: 2,
        discountedPrice: 2200,
        furnished: true,
        geolocation: { lng: '-73.150530', lat: '41.205590' },
        imageUrls: ["https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60"
        ],
        location: "8601 West Peachtree St Stratford, CT 06614",
        name: "Beautiful",
        offer: false,
        parking: true,
        regularPrice: 2500,
        timestamp: { seconds: 1669068990, nanoseconds: 974000000 },
        type: "rent",
        userRef: "dQyJ1c0f5wgJ0kZfDzIr8EpsMrC3",
    },
    {
        bathrooms: 2,
        bedrooms: 2,
        discountedPrice: 2200,
        furnished: true,
        geolocation: { lng: '-73.150530', lat: '41.205590' },
        imageUrls: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60", "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=900&q=60"
        ],
        location: "8601 West Peachtree St Stratford, CT 06614",
        name: "Beautiful",
        offer: true,
        parking: true,
        regularPrice: 2500,
        timestamp: { seconds: 1669068990, nanoseconds: 974000000 },
        type: "rent",
        userRef: "dQyJ1c0f5wgJ0kZfDzIr8EpsMrC3",
    },
];

export const fetchCategories = async () => {
    const listings = await getCategoryAndDocuments();
    return listings;
}

export const CategoriesProvider = ({ children }) => {
    const [listings, setListings] = useState([]);

    const addListingItem = async (listing) => {
        try {
            await addListingDocument(listing);
            const newItems = await fetchCategories();
            setListings(newItems);
            // Or setListings([...listings, listing]);
            toast.success("listing is added");
        } catch (error) {
            toast.error(error);
        }
    }
    const deleteListingItem = async (listingId) => {
        await deleteListingDocument(listingId);
        try {
            await deleteListingDocument(listingId);
            const newItems = await fetchCategories();
            setListings(newItems);
            // Or setListings(listings.filter(listing) => listing.id !== listingId);
            toast.success("listing is deleted");
        } catch (error) {
            toast.error(error);
        }
    }

    useEffect(() => {

    }, [])

    const value = { listings, setListings, addListingItem, deleteListingItem };
    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
};