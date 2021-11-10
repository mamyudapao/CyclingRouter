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
          <li>
            <Link href="home">Home</Link>
          </li>
          <li>AUTHORS</li>
          <li>EXPLORE</li>
          <li>BLOG</li>
          <li>CONTACT</li>
        </div>
        <div className={styles.right}>
          <li>
            <Link href="signup">SignUp</Link>
          </li>
          <li>
            <Link href="login">LogIn</Link>
          </li>
        </div>
      </ul>
    </>
  );
};

export default Header;
