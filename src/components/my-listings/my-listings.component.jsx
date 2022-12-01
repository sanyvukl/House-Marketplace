import { Fragment } from "react";
import { useState, useEffect } from "react";
import { getUserListings } from "../../utils/firebase/firebase.utils";
import ListingItem from "../listing-item/listing-item";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { CategoryContext } from "../../context/category/category.context";
import { toast } from "react-toastify";

const MyListings = ({ userId }) => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const { deleteListingItem } = useContext(CategoryContext);

    useEffect(() => {
        const getListings = async () => {
            const data = await getUserListings(userId);
            setListings(data);
        }
        getListings();
    }, []);

    const onDeleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            deleteListingItem(id);
            setListings(listings.filter((listing) => listing.id !== id));
            toast.success("Successfuly deleted listing");
        }
    }
    const onEditHandler = (id) => {
        navigate(`/edit-listing/${id}`);
    }

    return (
        <Fragment>
            <p className="listingText">My Listings</p>
            <ul className="listingsList">
                {listings.map((listing) => {
                    const { id, data } = listing;
                    return <ListingItem
                        key={id}
                        id={id}
                        listing={data}
                        onDelete={() => onDeleteHandler(id)}
                        onEdit={() => onEditHandler(id)}
                    />
                })}
            </ul>
        </Fragment>
    );
}
export default MyListings;