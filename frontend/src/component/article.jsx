import React, { useState, useEffect, useParams } from 'react';

export default function Article() {
    const { id } = useParams(); 
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch(`/api/article/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('error fetching article');
            return res.json();
        })
        .then(data => {
            if (data.success) {
                setArticle(data.article);
            }
        }).catch(err => console.error("Erreur:", err));
    }, [id]);

    return (
        <div className="article-container">
            {article ? (
              <>
                <h1>{article.title}</h1>
                <p>Auteur : {article.publisher}</p>
                <hr />
                <p>{article.content}</p>
              </>
            ) : (
              <p>Loading...</p>
            )}
        </div>
    );
};