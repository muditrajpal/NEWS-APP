import React from 'react';
import { Article } from './NewsFeed';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  loading: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, loading }) => (
  <div className='articles'>
    {loading ? (
      <p>Loading articles...</p>
    ) : articles.length === 0 ? (
      <>
      <p>No articles found.</p>
      <i>For news API.org Requests from the browser are not allowed on the Developer plan, except from localhost</i>
      </>
    ) : (
      articles.map((a, i) => <ArticleCard key={i} article={a} />)
    )}
  </div>
);

export default ArticleList;
