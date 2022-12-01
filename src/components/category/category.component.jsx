import { useParams, useNavigate } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import { CategoryContext } from "../../context/category/category.context";
import ListingItem from "../listing-item/listing-item";
import Spinner from "../Spinner/spinner.component";
import { getCategoryLisings } from "../../utils/firebase/firebase.utils";
import { toast } from "react-toastify";

const Category = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { deleteListingItem } = useContext(CategoryContext);
    const [categoryListings, setCategoryListings] = useState([]);
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        const getListings = async () => {
            const data = await getCategoryLisings(["type", "==", params.categoryName]);
            setCategoryListings(data);
        };
        getListings();
    }, [deleteListingItem]);

    // Load More... 
    const onLoadMoreListings = async () => {
        const increment = categoryListings.length + 5;
        try {
            const data = await getCategoryLisings(params.categoryName, increment);
            console.log(data);
            setCategoryListings(data);
        } catch (error) {
            toast.error(error);
        }

        if (categoryListings.length !== increment) {
            setIsShow(false);
            toast.warning("Nothing to load");
        }
    };

    const onEditHandler = (id) => {
        navigate(`/edit-listing/${id}`);
    };

    const onDeleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            deleteListingItem(id);
            // setListings(listings.filter((listing) => listing.id !== id));
            toast.success("Successfuly deleted listing");
        }
    };

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    {params.categoryName === "rent"
                        ? "Places for rent"
                        : "Places for sale"}
                </p>
            </header>

            {categoryListings.length > 0 ? (
                <Fragment>
                    <main>
                        <ul className="categoryListings">
                            {categoryListings.map((listing) => {
                                const { id, data } = listing;
                                return (
                                    <ListingItem
                                        key={id}
                                        id={id}
                                        listing={data}
                                        onDelete={() => onDeleteHandler(id)}
                                        onEdit={() => onEditHandler(id)}
                                    />
                                );
                            })}
                        </ul>
                    </main>

                    <br />
                    <br />

                    {isShow &&
                        <p className="loadMore" onClick={onLoadMoreListings}>
                            Load More
                        </p>
                    }
                </Fragment>
            ) : (
                <p>No offers for {params.categoryName}... </p>
            )}
        </div>
    );
};

export default Category;
