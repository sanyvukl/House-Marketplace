import { Fragment } from "react";
import { useState, useEffect } from "react";
import { getUserListings } from "../../utils/firebase/firebase.utils";
import ListingItem from "../listing-item/listing-item";

import { useContext } from "react";
import { CategoryContext } from "../../context/category/category.context";
import { toast } from "react-toastify";

const MyListings = ({ userId }) => {
    const [listings, setListings] = useState([]);
    const { deleteListingItemById } = useContext(CategoryContext);

    useEffect(() => {
        const getListings = async () => {
            const data = await getUserListings(userId);
            setListings(data);
        }
        getListings();
    }, []);

    const onDeleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            deleteListingItemById(id);
            setListings(listings.filter((listing)=>listing.id !== id));
            toast.success("Successfuly deleted listing");
        }
    }

    return (
        <Fragment>
            <p className="listingText">My Listings</p>
            <ul className="listingsList">
                {listings.map((listing) => {
                    const { id, data } = listing;
                    return <ListingItem key={id} id={id} listing={data} onDelete={() => onDeleteHandler(id)} />
                })}
            </ul>
        </Fragment>
    );
}
export default MyListings;