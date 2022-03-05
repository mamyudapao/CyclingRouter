import styles from "./header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faBiking, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { usersState } from "../../reducks/user/userSlice";
const Header = (props: any): JSX.Element => {
  const store = useSelector((state: usersState) => state);
  return (
    <>
      <ul className={styles.header}>
        <div className={styles.left}>
          <li className={styles.logo}>
            <FontAwesomeIcon icon={faBiking as any} className="fa-lg" />
          </li>
        </div>
        <div className={styles.center}>
          <li>
            <Link href="/">
              <a>ホーム</a>
            </Link>
          </li>
          {store.accessToken !== "" && (
            <>
              <li>
                <Link href="/timeline">
                  <a>タイムライン</a>
                </Link>
              </li>
              <Link href="/routers">
                <a>経路を探す</a>
              </Link>
            </>
          )}
        </div>
        <div className={styles.right}>
          {store.accessToken !== "" && (
            <>
              <li>
                <Link href={`/${store.user.id}/profile`} replace={true}>
                  <a>
                    <FontAwesomeIcon icon={faUserCircle as any} />
                  </a>
                </Link>
              </li>
            </>
          )}
          {store.accessToken === "" && (
            <>
              <li>
                <Link href="/signup">SignUp</Link>
              </li>
              <li>
                <Link href="/login">LogIn</Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </>
  );
};

export default Header;
