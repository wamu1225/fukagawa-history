import { routeStops } from '../data/route';
import { SITE_NAME } from '../data/static-pages';
import { href } from '../lib/router';

export default function Home() {
  return (
    <>
      <div className="home-intro">
        <h1 className="content-h1">{SITE_NAME}</h1>
        <p className="home-intro__lede">
          深川を歩くと、不自然に広い道や、住宅街の中を蛇行する緑地に出会う。その多くは、かつてここにあった運河が埋め立てられた跡だ。
        </p>
        <p>
          このサイトでは、実際に今も訪ねられる7つの地点を、地理的な順路にそって紹介する。各地点で「かつて何があったか」と「今何が見えるか」をあわせて示す。
        </p>
      </div>

      <h2 className="route-heading">深川さんぽルート</h2>
      <ol className="route-list">
        {routeStops.map((stop) => (
          <li key={stop.id}>
            <a className="route-stop" href={href(`/articles/${stop.articleId}/`)}>
              <span className="route-stop__marker">{stop.order}</span>
              <div className="route-stop__area">{stop.area}</div>
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
