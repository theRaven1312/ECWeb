import {useState} from "react";
import ProductImg1 from "../../public/Assets/ProductionAssets/t-shirt1.png";
import ProductImg2 from "../../public/Assets/ProductionAssets/t-shirt2.png";
import ProductImg3 from "../../public/Assets/ProductionAssets/t-shirt3.png";
const thumbnails = [ProductImg1, ProductImg2, ProductImg3];

const ProductImg = () => {
    const [selectedImage, setSelectedImage] = useState(thumbnails[0]);

    return (
        <div className="productImg-container">
            {thumbnails.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className={`img-left  ${
                        img === selectedImage
                            ? "border-black border-2 "
                            : "border-transparent opacity-50"
                    }`}
                    alt="thumb"
                />
            ))}
            <div className="img-right ">
                <img
                    src={selectedImage}
                    className="rounded-2xl w-full h-full"
                    alt="main"
                />
            </div>
        </div>
    );
};

export default ProductImg;
