export default function Comments ({comments, showComment, handlePostComment, loading, setUserComment}) {
    return (
        <>
        { showComment && 
            <div className="flex flex-col px-0.5 ss:gap-4 gap-2 text-gray-700 dark:text-gray-200 overflow-auto">
                <div className="flex flex-col items-center ss:gap-4 gap-2 overflow-auto scrollbar-hide">
                    {comments?.map((comment, index) => {
                        return (
                            <div className="flex flex-row gap-2 w-full max-w-xs items-end" key={index} >
                                <div>
                                    { comment?.avatar ? 
                                        <img src= {`/api/${comment.avatar}`} className="ss:w-6 ss:h-6 w-5 h-5 object-contains rounded-full mb-1"/>
                                        : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ss:w-6 ss:h-6 w-5 h-5 pb-1">
                                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                        </svg> }
                                </div>

                                <div className="flex flex-col gap-0.5 hyphens-auto overflow-auto scrollbar-hide">
                                    <div className="ss:text-base text-sm font-bold sticky left-0">{comment.user_name}</div>
                                    <div className="ss:text-lg text-base">{comment.comment}</div>
                                </div>
                            </div>
                        )
                    })}

                </div>
                <div className="flex flex-row gap-2" >
                    <input
                        className=" block py-2 pl-3 pr-3 w-full bg-gray-200 text-gray-900 text-sm rounded-lg border-2 border-zinc-500 focus:outline-none focus:ring-zinc-500 focus:border-gray-800 dark:bg-gray-800 dark:border-zinc-500 dark:text-gray-100 dark:focus:ring-zinc-500 dark:focus:border-gray-300"
                        type="comment"
                        onChange={e => setUserComment(e.target.value)}
                    />
                    <button disabled={loading} onClick={handlePostComment}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-800 dark:text-gray-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        }
        </>
    );
}