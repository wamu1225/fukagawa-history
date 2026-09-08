import { routeStops } from '../data/route';
import { SITE_NAME } from '../data/static-pages';
import { href } from '../lib/router';

export default function Home() {
  return (
    <>
      <div className="home-intro">
        <h1 className="content-h1">{SITE_NAME}</h1>
        <p className="home-intro__lede">
          深川を歩くと、不自然に広い道や、住宅街の中を蛇行する緑地に出会う。その多くは、今も流れている運河、または埋め立てられた運河の跡だ。
        </p>
        <p>
          このサイトでは、小名木川から木場まで、運河にまつわる9つの地点を地理的な順路にそって紹介する。運河そのものの跡（緑のマーカー）に加えて、採荼庵跡と富岡八幡宮は運河のすぐ近くにある寄り道（橙のマーカー）として位置づける。各地点で「かつて何があったか」と「今何が見えるか」をあわせて示す。
        </p>
      </div>

      <h2 className="route-heading">深川さんぽルート</h2>
      <ol className="route-list">
        {routeStops.map((stop) => (
          <li key={stop.id}>
            <a className="route-stop" href={href(`/articles/${stop.articleId}/`)}>
              <span className={`route-stop__marker${stop.category === 'context' ? ' route-stop__marker--context' : ''}`}>
                {stop.order}
              </span>
              <div className="route-stop__area">
                {stop.area}
                {stop.category === 'context' && <span className="route-stop__tag">寄り道</span>}
              </div>
              <div className="route-stop__name">{stop.name}</div>
              <div className="route-stop__today">
                <strong>今：</strong>
                {stop.whatYouSeeToday}
              </div>
            </a>
          </li>
        ))}
      </ol>
    </>
  );
}
