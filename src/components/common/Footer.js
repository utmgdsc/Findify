import "./footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return <footer class="fixed-bottom">{`Copyright © Findify ${year}`}</footer>;
};

export default Footer;
