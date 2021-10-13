import styles from './header.module.scss';
const Header = () => {
  return (
    <div>
      <ul className={styles.header}>
        <li>Logo</li>
        <li>FEED</li>
        <li>AUTHORS</li>
        <li>EXPLORE</li>
        <li>BLOG</li>
        <li>CONTACT</li>
      </ul>
    </div>
  )
}

export default Header;