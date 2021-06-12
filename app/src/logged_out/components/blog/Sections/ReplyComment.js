import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {

        let commentNumber = 0;
        props.CommentLists.map((comment) => {

            if (comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [])


    let renderReplyComment = (parentCommentId) =>
        props.CommentLists.map((comment, index) => (
            <React.Fragment key={index}>
                {comment.responseTo === parentCommentId &&
                <div style={{ width: '80%', marginLeft: '40px' }}>
                    <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                    <ReplyComment CommentLists={props.CommentLists} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
                </div>
                }
            </React.Fragment>
        ))

    const handleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }


    return (
        <div style={{paddingBottom: 16, paddingLeft: 16}}>

            {ChildCommentNumber > 0 &&
            <p style={{userSelect: 'none', fontSize: '14px', margin: 0, color: 'gray', paddingBottom: 24, paddingLeft: 42, cursor: 'pointer' }}
               onClick={handleChange} >
                View {ChildCommentNumber} more comment(s)
            </p>
            }

            {OpenReplyComments &&
            renderReplyComment(props.parentCommentId)
            }

        </div>
    )
}

export default ReplyComment
