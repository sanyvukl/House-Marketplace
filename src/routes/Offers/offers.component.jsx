import { useContext } from "react";
import { CategoryContext } from "../../context/category/category.context";
import ListingItem from "../../components/listing-item/listing-item";
import Spinner from "../../components/Spinner/spinner.component";

const Offers = () => {
    const { listings, deleteListing } = useContext(CategoryContext);
    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    Offers
                </p>
            </header>
            {listings.length > 0
                ? <main>
                    <ul className="categoryListings">
                        {listings
                            .filter((listing) => listing.data.offer)
                            .map((listing) => {
                                const { id, data } = listing;
                                return (
                                    <ListingItem key={id} id={id} listing={data} onDelete={deleteListing} />
                                );
                            })}
                    </ul>
                </main>
                : <Spinner />}
                {/* // : <p>No Offers</p> */}
        </div>
    );
}

export default Offers;