import { useState } from "react";

const NavigationItem = ({children}) => {
    const [isActive, setIsActive] = useState(false);
    const handleClick = () =>{
        setIsActive(!isActive);
    }

    return (
        <div className={isActive ? "active" : ""} onClick={()=>handleClick()}>
            {children}
        </div>
    )
}
export default NavigationItem;