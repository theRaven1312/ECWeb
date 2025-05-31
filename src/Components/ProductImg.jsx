import {useState, useEffect} from "react";

const ProductImg = ({images, mainImage}) => {
    const thumbnails = [mainImage, ...(images || [])];
    const [selectedImage, setSelectedImage] = useState(thumbnails[0]);

    useEffect(() => {
        setSelectedImage(mainImage);
    }, [mainImage]);

    return (
        <div className="w-full h-full grid grid-cols-4 max-sm:flex max-sm:flex-col max-sm:items-center">
            {/* Thumbnails */}
            <div
                className="flex flex-col gap-2 overflow-y-auto scrollbar-hide max-h-[500px] flex-center-between w-full
                       max-sm:flex-row max-sm:overflow-x-auto
                       max-sm:w-full max-sm:px-1 max-sm:order-2 max-sm:flex-center-between"
            >
                {thumbnails.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        onClick={() => setSelectedImage(img)}
                        className={`cursor-pointer rounded-md aspect-[3/4] object-cover max-w-20
                            max-sm:h-24 max-sm:w-auto max-sm:min-w-[60px] max-sm:flex-shrink-0
                            transition-all duration-200
                            ${
                                img === selectedImage
                                    ? "border-2 border-black"
                                    : "opacity-50 border border-transparent"
                            }`}
                        alt="thumb"
                    />
                ))}
            </div>
            {/* Ảnh chính */}
            <div className="col-span-3 order-2 max-sm:order-1 flex justify-center items-center">
                <img
                    src={selectedImage}
                    className="rounded-2xl w-auto max-h-[500px] object-cover"
                    alt="main"
                />
            </div>
        </div>
    );
};

export default ProductImg;
