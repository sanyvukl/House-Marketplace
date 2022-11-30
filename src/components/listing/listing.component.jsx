import { useEffect, useState, useContext } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { CategoryContext } from "../../context/category/category.context";
import shareIcon from "../../assets/svg/shareIcon.svg";
import Spinner from "../Spinner/spinner.component";
import SliderItem from "../slider-item/slider-item.component";
import ListingDetails from "../listing-details/listing-details.component";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { toast } from "react-toastify";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


const Listing = () => {
    const params = useParams();
    const { getListingItem } = useContext(CategoryContext);
    const [listing, setListing] = useState({});

    useEffect(() => {
        const getListingInfo = async () => {
            const data = await getListingItem(params.listingId);
            setListing(data);
        };
        getListingInfo();
    }, []);

    return Object.keys(listing).length === 0 ? <Spinner /> : (
        <main>
            <Swiper slidesPerView={1} pagination={{ clickable: true }}>
                {listing.imageUrls.map((url, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <SliderItem url={url} />
                        </SwiperSlide>
                    )
                })}
            </Swiper>

            <div className="shareIconDiv"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link Copied", { delay: 0 });
                }}
            >
                <img src={shareIcon} alt="share" />
            </div>

            <ListingDetails listing={listing} />
        </main>
    );
};
export default Listing;
