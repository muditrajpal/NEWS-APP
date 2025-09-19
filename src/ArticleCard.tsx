import React from 'react';
import { Article } from './NewsFeed';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => (
  <div className='article'>
    {article.urlToImage && (
      <img
        src={article.urlToImage}
        alt={article.title}
        className='article-img'
      />
    )}
    <h2>{article.title}</h2>
    <p>{article.description}</p>
    <p>
      <b>Source:</b> {article.source.name} | <b>Date:</b>{' '}
      {article.publishedAt?.slice(0, 10)}
    </p>
    <a href={article.url} target='_blank' rel='noopener noreferrer'>
      Read more
    </a>
  </div>
);

export default ArticleCard;
