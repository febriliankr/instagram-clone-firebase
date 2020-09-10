import React, { useState, useEffect } from 'react'
import './Post.styles.css'
import { db } from '../config/firebaseConfig';
import 'firebase/firestore'
import Avatar from '@material-ui/core/Avatar'

function Post({ postId, username, caption, imageUrl, signedInUser }) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc => doc.data())))
                })
        }

        return () => {
            unsubscribe();
        }
    }, [postId])

    const handleSubmitComment = e => {
        e.preventDefault();
        console.log(comment);
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: signedInUser.displayName
        })
        setComment('')
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt='Febrilian' src="" />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt="" />
            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>

            <div className="post__comments">
                {
                    comments && comments.map(comment => (
                        <p>
                            {comment.username}: {comment.text}
                        </p>
                    ))
                }
            </div>

            {
                signedInUser && (
                    <form onSubmit={handleSubmitComment}>
                        <input className="post__input" type="text" placeholder="add a comment..." value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                    </form>
                )
            }


        </div>
    )
}

export default Post
