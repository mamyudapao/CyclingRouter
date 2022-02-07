import Style from "./footer.module.scss";
const Footer = (): JSX.Element => {
  return (
    <div className={Style.footer}>
      <ul>
        <li>Footer</li>
        <li>Footer Contents</li>
      </ul>
    </div>
  );
};
export default Footer;
