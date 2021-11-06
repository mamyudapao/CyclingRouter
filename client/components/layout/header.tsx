import styles from "./header.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  faBiking,
  faSearch,
  faBell,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
const Header = () => {
  return (
    <>
      <ul className={styles.header}>
        <div className={styles.left}>
          <li className={styles.logo}>
            <FontAwesomeIcon icon={faBiking} className="fa-lg" />
          </li>
        </div>
        <div className={styles.center}>
          <Link href="home">
            <li>Home</li>
          </Link>
          <li>AUTHORS</li>
          <li>EXPLORE</li>
          <li>BLOG</li>
          <li>CONTACT</li>
        </div>
        <div className={styles.right}>
          <li>
            <FontAwesomeIcon icon={faSearch} />
          </li>
          <li>
            <FontAwesomeIcon icon={faBell} />
          </li>
          <li>
            <Link href="signup">
              <FontAwesomeIcon icon={faSignInAlt} />
            </Link>
          </li>
        </div>
      </ul>
    </>
  );
};

export default Header;
