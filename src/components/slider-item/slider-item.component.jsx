import { Fragment } from "react";


const SliderItem = ({ url, children }) => {
    return (
        <Fragment>
            <div className="swiperSlideDiv" style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover"
            }}
            ></div>
            <Fragment>
                {children}
            </Fragment>
        </Fragment>
    )
}
export default SliderItem;