import { articles } from '../data/articles';
import { href } from '../lib/router';

export default function ArticleIndex() {
  return (
    <>
      <h1 className="content-h1">記事一覧</h1>
      <p className="content-p">深川の水路と土地の歴史をテーマ別にまとめた8本の記事です。</p>
      <ul className="article-index-list">
        {articles.map((a) => (
          <li key={a.id}>
            <a href={href(`/articles/${a.id}/`)}>{a.title}</a>
            <p>{a.dek}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
