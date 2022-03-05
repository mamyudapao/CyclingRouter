import Style from "./footer.module.scss";
const Footer = (): JSX.Element => {
  return (
    <div className={Style.footer}>
      <ul>
        <li>
          <h2 className={Style.logo}>CyclingRouter</h2>
        </li>
      </ul>
    </div>
  );
};
export default Footer;
