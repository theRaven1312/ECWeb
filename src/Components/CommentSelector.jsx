import CommentSelectorBtn from "./CommnetSelectorBtn";

export default function CommentSelector({select}) {
    return (
        <div className="commentselector w-[90%] flex ">
            <CommentSelectorBtn
                btn_content="Rating & Reviews"
                select={select}
            />
        </div>
    );
}
