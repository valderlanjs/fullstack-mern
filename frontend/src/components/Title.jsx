import React from "react";

const Title = ({title, titleStyles}) => {
    return (
        <div className={`${titleStyles} pb-20`}>
            <span className="h2 capitalize pb-1 relative after:w-2/3 after:h-1 after:bg-secondary after:absolute after:-bottom-1 after:right-0 after:rounded">{title}</span>
        </div>
    )
}

export default Title;