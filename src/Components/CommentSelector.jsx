import CommentSelectorBtn from "./CommnetSelectorBtn";

export default function CommentSelector({select}) {
    return (
        <div className="commentselector flex ">
            <CommentSelectorBtn btn_content="Product Detail" select={select} />
            <CommentSelectorBtn
                btn_content="Rating and Reviews"
                select={select}
            />
            <CommentSelectorBtn btn_content="FAQs" select={select} />
        </div>
    );
}
