import Prompt from "../Components/Prompt.jsx";
import Navbar from "../Components/Navbar.jsx";
import MainContainer from "../Components/MainContainer.jsx";
import DirectLink from "../Components/DirectLink.jsx";
import ProductImg from "../Components/ProductImg.jsx";
import ProductInfo from "../Components/ProductInfo.jsx";
import CommentSelector from "../Components/CommentSelector.jsx";
import CommentDisplay from "../Components/CommentDisplay.jsx";
import FourItemDisplay from "../Components/FourItemDisplay.jsx";
import Footer from "../Components/Footer.jsx";
import CommentCard from "../Components/CommentCard.jsx";

export default function ProductionPage() {
    return (
        <>
            <div class="flex flex-col flex-center">
                <div className="w-[80%] h-px bg-gray-300"></div>
            </div>
            <MainContainer>

                <div className="product-container">
                    <div className="product-img">
                        <ProductImg />
                    </div>
                    <div className="product-content ">
                        <ProductInfo />
                    </div>
                </div>

                {/* Comment-Section */}

                <CommentSelector />

                <div className="comment-header">
                    <div className="flex items-center">
                        <h1 className="comment-heading">All reviews</h1>
                        <span className="comment-quanity">(451)</span>
                    </div>

                    <div className="flex">
                        <button className="primary-btn comment-header__adjustBtn">
                            <i class="fa-solid fa-sliders"></i>
                        </button>

                        <div className="comment-header__moreBtn">
                            <span className="max-sm:text-sm">Latest</span>
                            <button className="w-[16px] h-[16px] cursor-pointer flex-center ml-2 hover:bg-gray-100 rounded-full">
                                <i class="fa-solid fa-angle-down "></i>
                            </button>
                        </div>

                        <button className="primary-btn comment-header__writeBtn">
                            Write a preview
                        </button>
                    </div>
                </div>
                <div className="commentSection">
                    <CommentCard />
                    <CommentCard />
                    <CommentCard />
                    <CommentCard />
                    <CommentCard />
                    <CommentCard />
                </div>
                <button className="primary-btn learnMoreBtn">
                    Learn More Reviews
                </button>

                <FourItemDisplay />
            </MainContainer>
        </>
    );
}
