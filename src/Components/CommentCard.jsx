import React from 'react'
import start from '../../public/Assets/star.svg'
import verf from '../../public/Assets/verified.svg'


const CommentCard = () => {
  return (
    <div className='commentCard'>
        <div className='ratingStar'>
            <img src={start} alt="star" />
            <img src={start} alt="star" />
            <img src={start} alt="star" />
            <img src={start} alt="star" />
        </div>
        <div className='customer'>
            <div className='name'>Some dude</div>
            <img src={verf}/>
        </div>
        <p className='comment'>Filler text is text that shares some characteristics of a real written text, but is random or otherwise generated. It may be used to display a sample of fonts, generate text for testing, or to spoof an e-mail spam filter.</p>
    </div>
  )
}

export default CommentCard
