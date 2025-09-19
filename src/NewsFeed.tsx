import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './App.css';
import FilterForm from './FilterForm';
import ArticleList from './ArticleList';
import { fetchArticles } from './api';

export interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt?: string;
  source: { name: string };
  _apiSource: string;
}

const categories = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
];

const sourcesList = ['guardian', 'nyt', 'newsapi'];

function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [source, setSource] = useState<string>('nyt');
  const [date, setDate] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    fetchAllArticles();
    // eslint-disable-next-line
  }, [search, category, source, date]);

  const savePreference = () => {
    localStorage.setItem(
      'newsFilters',
      JSON.stringify({ search, category, source, date }),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearPreference = () => {
    localStorage.removeItem('newsFilters');
    setSearch('');
    setCategory('');
    setSource('newsapi');
    setDate('');
  };

  const fetchAllArticles = async () => {
    setLoading(true);
    const allArticles = await fetchArticles(source, search, category, date);
    setArticles(allArticles);
    setLoading(false);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchAllArticles();
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>News Search</h1>
        <FilterForm
          search={search}
          category={category}
          source={source}
          date={date}
          saved={saved}
          categories={categories}
          onSearchChange={(value: string) => setSearch(value)}
          onCategoryChange={(e) => setCategory(e.target.value)}
          onSourceChange={(e) => setSource(e.target.value)}
          onDateChange={(e) => setDate(e.target.value)}
          onSubmit={handleSearch}
          onSave={savePreference}
          onClear={clearPreference}
        />
        <ArticleList articles={articles} loading={loading} />
      </header>
    </div>
  );
}

export default NewsFeed;
