import styles from "./header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { faBiking, faUserCircle } from "@fortawesome/free-solid-svg-icons";
const Header = (props: any) => {
  return (
    <>
      <ul className={styles.header}>
        <div className={styles.left}>
          <li className={styles.logo}>
            <FontAwesomeIcon icon={faBiking} className="fa-lg" />
          </li>
        </div>
        <div className={styles.center}>
          <li>
            <Link href="/home">
              <a>Home</a>
            </Link>
          </li>
          <li>AUTHORS</li>
          <li>EXPLORE</li>
          <li>BLOG</li>
          <li>CONTACT</li>
        </div>
        <div className={styles.right}>
          {props.auth !== undefined && (
            <>
              <li>
                <Link href="/profile">
                  <a>
                    <FontAwesomeIcon icon={faUserCircle} />
                  </a>
                </Link>
              </li>
            </>
          )}
          {props.auth === undefined && (
            <>
              <li>
                <Link href="signup">SignUp</Link>
              </li>
              <li>
                <Link href="login">LogIn</Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </>
  );
};

export default Header;
