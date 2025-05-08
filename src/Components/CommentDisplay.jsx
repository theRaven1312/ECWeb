import React from 'react'
import CommentCard from './CommentCard'

const CommentDisplay = () => {
  return (
    <div className='commentDisplay'>
      <div className='heading'>our happy customers</div>
      <div className='commentList'>
        <CommentCard/>
        <CommentCard/>
        <CommentCard/>
      </div>
      
    </div>
  )
}

export default CommentDisplay
