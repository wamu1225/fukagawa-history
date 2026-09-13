import { articles, CATEGORY_LABEL } from '../data/articles';
import { href } from '../lib/router';

export default function ArticleIndex() {
  return (
    <>
      <h1 className="content-h1">記事一覧</h1>
      <p className="content-p">深川の地名の由来から、運河の水路網、松尾芭蕉、富岡八幡宮、深川めしまでをまとめた記事一覧です。</p>
      <ul className="article-index-list">
        {articles.map((a) => (
          <li key={a.id}>
            <span className="article-index-list__category">{CATEGORY_LABEL[a.category]}</span>
            <a href={href(`/articles/${a.id}/`)}>{a.title}</a>
            <p>{a.dek}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
