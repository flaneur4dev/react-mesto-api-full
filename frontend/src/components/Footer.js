import { memo } from "react";

function Footer() {
  return (
    <footer className="footer page__section">
      <p className="footer__copyright">{`© ${new Date().getFullYear()} Mesto Russia`}</p>
    </footer>
  )
}

export default memo(Footer)