import { useEffect, useState, useContext, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../Spinner/spinner.component";
import SliderItem from "../slider-item/slider-item.component";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { getListingsForExplore } from "../../utils/firebase/firebase.utils";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Slider = () => {
    const [listings, setListings] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            const data = await getListingsForExplore();
            setListings(data);
        };
        getData();
    }, []);

    const onClickHandler = (type, id) => {
        navigate(`/category/${type}/${id}`);
    }

    return listings === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <p className="exploreHeading">Recomended</p>
            <Swiper slidesPerView={1} pagination={{ clickable: true }}>
                {listings.map(({ data, id }) => {
                    return (
                        <SwiperSlide key={id} onClick={() => onClickHandler(data.type, id)}>
                            <SliderItem url={data.imageUrls[0]}>
                                <p className="swiperSlideText">{data.name}</p>
                                <p className="swiperSlidePrice">
                                    ${data.discountedPrice > 0 ? data.discountedPrice : data.regularPrice}
                                    {data.type === "rent" && " / month"}
                                </p>
                            </SliderItem>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </Fragment>
    );
};

export default Slider;
