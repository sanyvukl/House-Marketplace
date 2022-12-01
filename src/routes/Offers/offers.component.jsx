import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "../../context/category/category.context";
import ListingItem from "../../components/listing-item/listing-item";
import Spinner from "../../components/Spinner/spinner.component";
import { toast } from "react-toastify";

import { getCategoryLisings } from "../../utils/firebase/firebase.utils";

const Offers = () => {
    // const { deleteListing } = useContext(CategoryContext);
    const [offerListings, setOfferListings] = useState([]);
    const [isShow, setIsShow] = useState(true);

    useEffect(() => {
        const getListings = async () => {
            const data = await getCategoryLisings(["offer", "==", true]);
            setOfferListings(data);
        };
        getListings();
    }, []);

    const onLoadMoreListings = async () => {
        const increment = offerListings.length + 5;
        try {
            const data = await getCategoryLisings(["offer", "==", true], increment);
            console.log(data);
            setOfferListings(data);
        } catch (error) {
            toast.error(error);
        }

        if (offerListings.length !== increment) {
            setIsShow(false);
            toast.warning("Nothing to load");
        }
    };

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                    Offers
                </p>
            </header>
            {offerListings.length
                ? <main>
                    <ul className="categoryListings">
                        {offerListings.map((listing) => {
                            const { id, data } = listing;
                            return (
                                <ListingItem key={id} id={id} listing={data} />
                            );
                        })}
                    </ul>
                    {isShow &&
                        <p className="loadMore" onClick={onLoadMoreListings}>
                            Load More
                        </p>
                    }
                </main>
                : <p>No offers so far ...</p>}
            {/* // :<Spinner /> */}
        </div>
    );
}

export default Offers;