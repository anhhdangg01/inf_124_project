import React from 'react';

interface CommentProps {
    text: string;
}

const Comment: React.FC<CommentProps> = ({ text }) => {
    return (
        <div style={styles.commentBox}>
            <p style={styles.commentText}>{text}</p>
        </div>
    );
};

const styles = {
    commentBox: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        maxWidth: '400px',
        margin: '10px auto',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    commentText: {
        margin: 0,
        fontSize: '14px',
        color: '#333',
    },
};

export default Comment;