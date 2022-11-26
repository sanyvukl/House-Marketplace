import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "../../context/category/category.context";
import ListingItem from "../listing-item/listing-item";
import Spinner from "../Spinner/spinner.component";

const Category = () => {
    const params = useParams();
    const { listings, deleteListingItem } = useContext(CategoryContext);

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    {params.categoryName === "rent"
                        ? "Places for rent"
                        : "Places for sale"
                    }
                </p>
            </header>

            {listings.length > 0
                ? <main>
                    <ul className="categoryListings">
                        {listings
                        .filter((listing) => listing.data.type === params.categoryName)
                        .map((listing) => {
                            const { id, data } = listing;
                            return (
                                <ListingItem key={id} id={id} listing={data} onDelete={deleteListingItem} />
                            );
                        })}
                    </ul>
                </main>
                : <p>No Listings for {params.categoryName}</p>}
        </div>
    );
}

export default Category;