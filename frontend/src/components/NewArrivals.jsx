import { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { ShopContext } from "../context/ShopContext";
import TreeCard from "./TreeCard"


const NewArrivals = () => {

    const {products} = useContext(ShopContext);
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        const data = products.slice(0,10)
        setNewArrivals(data)
    },[products])

    return (
        <section className="max-padd-container py-16">
            <Title  title={'Principais Produtos'} titleStyles={'text-center '}/>
          
            <div className="grid grid-cols-2 xs:grid-cold-2 md:grid-cols-3 xl:grid-cols-3 gap-8">
                {newArrivals.map((product)=> (
                    <div key={product.id}>
                        <TreeCard product={product}/>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default NewArrivals;