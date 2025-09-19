import { Article } from './NewsFeed';

export const NEWSAPI_KEY = '9a7ecd179d3c4565bb571b48e533226d';
export const NEWSAPI_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWSAPI_KEY}`;
export const GUARDIAN_KEY = '054120bd-bf86-4cd3-97e7-0eb0c3732889';
export const GUARDIAN_URL = `https://content.guardianapis.com/search?api-key=${GUARDIAN_KEY}`;
export const NYT_KEY = 'WpSixdEDeKKGFUFzSp7hDj41BEerXlI7';
export const NYT_URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${NYT_KEY}`;

export async function fetchNewsApiArticles(
  search: string,
  category: string,
  date: string,
): Promise<Article[]> {
  let url = NEWSAPI_URL;
  if (search) url += `&q=${search}`;
  if (category) url += `&category=${category}`;
  if (date) url += `&from=${date}`;
  const res = await fetch(url);
  const data = await res.json();
  let filtered: Article[] = data.articles || [];
  return filtered.map((a: Article) => ({ ...a, _apiSource: 'newsapi' }));
}

export async function fetchGuardianArticles(
  search: string,
  category: string,
  date: string,
): Promise<Article[]> {
  let url = GUARDIAN_URL;
  let guardianQ = '';
  if (category) guardianQ += category;
  if (search) guardianQ += (guardianQ ? ' ' : '') + search;
  if (guardianQ) url += `&q=${encodeURIComponent(guardianQ)}`;
  if (date) url += `&from-date=${date}`;
  const res = await fetch(url, {
    headers: {
      'Referrer-Policy': 'no-referrer',
    },
    referrerPolicy: 'no-referrer',
  });
  const data = await res.json();
  let filtered =
    data.response && data.response.results ? data.response.results : [];
  return filtered.map((a: any) => ({
    title: a.webTitle,
    description: a.fields?.trailText || '',
    url: a.webUrl,
    urlToImage: a.fields?.thumbnail || '',
    publishedAt: a.webPublicationDate,
    source: { name: 'The Guardian' },
    _apiSource: 'guardian',
  }));
}

export async function fetchNytArticles(
  search: string,
  category: string,
  date: string,
): Promise<Article[]> {
  let url = NYT_URL;
  let params: string[] = [];
  if (search) params.push(`q=${encodeURIComponent(search)}`);
  if (category) params.push(`fq=${encodeURIComponent(category)}`);
  if (date) {
    const dateStr = date.replace(/-/g, '');
    if (/^\d{8}$/.test(dateStr)) params.push(`begin_date=${dateStr}`);
  }
  if (params.length) url += '&' + params.join('&');
  const res = await fetch(url);
  const data = await res.json();
  let filtered = data.response && data.response.docs ? data.response.docs : [];
  return filtered.map((a: any) => ({
    title: a.headline?.main || '',
    description: a.abstract || a.snippet || '',
    url: a.web_url,
    urlToImage:
      a.multimedia && a.multimedia.length > 0
        ? `https://www.nytimes.com/${a.multimedia[0].url}`
        : '',
    publishedAt: a.pub_date,
    source: { name: 'NYT' },
    _apiSource: 'nyt',
  }));
}

export async function fetchArticles(
  source: string,
  search: string,
  category: string,
  date: string,
): Promise<Article[]> {
  if (source === 'newsapi') {
    return fetchNewsApiArticles(search, category, date);
  }
  if (source === 'guardian') {
    return fetchGuardianArticles(search, category, date);
  }
  if (source === 'nyt') {
    return fetchNytArticles(search, category, date);
  }
  return [];
}
