// src/pages/LandingPage.tsx
import React, { useEffect, useState } from "react";
import {
  GovBanner,
  Header,
  Title,
  NavMenuButton,
  ExtendedNav,
  NavDropDownButton,
  Menu,
  GridContainer,
  Grid,
  Search,
  Footer,
  FooterNav,
  SocialLink,
  SocialLinks,
  Logo,
  Address,
  Button,
} from "@trussworks/react-uswds";
import circleImg from "app/src/assets/circleImg.png";
import { Outlet, useFetcher } from "@remix-run/react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginButton from "~/src/components/LoginButton";
import { SessionData } from "@remix-run/node";
const LandingPage: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState([false, false]);
  const location = useLocation();
  const fetcher = useFetcher<SessionData>();
  const navigate = useNavigate();

  const toggleMobileNav = (): void => setMobileNavOpen((prev) => !prev);
  const handleToggleNavDropdown = (index: number): void => {
    setNavDropdownOpen((prev) => {
      const newState = Array(prev.length).fill(false);
      newState[index] = !prev[index];
      return newState;
    });
  };
  const handleSearch = (): void => {
    /* TODO */
  };

  // only load once if not already loaded
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data === undefined) {
      fetcher.load("/auth/sessions");
    }
  }, [fetcher]);

  const authenticated = fetcher.data?.authenticated;

  const checkRouteForHighlight = (iconRoute: string) => {
    const iconRouteBase = "/" + iconRoute?.split("/")?.slice(1);
    let actualRouteBase = "/" + location?.pathname?.split("/")?.slice(1);
    return iconRouteBase === actualRouteBase;
  };

  const primaryNavItems = [
    <React.Fragment key="primaryNav_0">
      <NavDropDownButton
        menuId="extended-nav-section-one"
        isOpen={navDropdownOpen[0]}
        label="Current section"
        onToggle={() => handleToggleNavDropdown(0)}
        isCurrent={false}
      />
      <Menu
        id="extended-nav-section-one"
        items={Array(1).fill(<a href="">Navigation link 0</a>)}
        isOpen={navDropdownOpen[0]}
      />
    </React.Fragment>,

    ...(!authenticated
      ? [
          <a
            key="primaryNav_1"
            className={`usa-nav__link ${
              checkRouteForHighlight("/home/submit-expense")
                ? "usa-current"
                : ""
            }`}
            href="/home/submit-expense"
          >
            <span>Submit An Expense</span>
          </a>,

          <a
            key="primaryNav_2"
            className={`usa-nav__link ${
              checkRouteForHighlight("/home/review-expense")
                ? "usa-current"
                : ""
            }`}
            href="/home/review-expense"
          >
            <span>Review An Expense</span>
          </a>,
        ]
      : []),
  ];

  const secondaryNavItems = [
    <a key="secondaryNav_0" href="">
      Secondary link
    </a>,
    <a key="secondaryNav_1" href="">
      Another secondary link
    </a>,
  ];

  const socialLinkItems = [
    <SocialLink key="facebook" name="Facebook" href=" " />,
    <SocialLink key="twitter" name="Twitter" href=" " />,
    <SocialLink key="youtube" name="YouTube" href=" " />,
    <SocialLink key="instagram" name="Instagram" href=" " />,
    <SocialLink key="rss" name="RSS" href=" " />,
  ];

  const footerPrimary = (
    <FooterNav
      aria-label="Footer navigation"
      size="medium"
      links={Array(5).fill(
        <a href=" " className="usa-footer__primary-link">
          Primary link
        </a>
      )}
    />
  );

  const footerSecondary = (
    <>
      <Grid row gap>
        <Logo
          size="medium"
          image={
            <img className="usa-footer__logo-img" src={circleImg} alt="" />
          }
          heading={<p className="usa-footer__logo-heading">Name of Agency</p>}
        />
        <Grid className="usa-footer__contact-links" mobileLg={{ col: 6 }}>
          <SocialLinks links={socialLinkItems} />
          <h3 className="usa-footer__contact-heading">Agency Contact Center</h3>
          <Address
            size="medium"
            items={[
              <a key="telephone" href="tel:1-800-555-5555">
                (800) CALL-GOVT
              </a>,
              <a key="email" href="mailto:info@agency.gov">
                info@agency.gov
              </a>,
            ]}
          />
        </Grid>
      </Grid>
    </>
  );

  const returnToTop = (
    <GridContainer className="usa-footer__return-to-top">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          background: "none",
          border: "none",
          color: "blue",
          textDecoration: "underline",
          cursor: "pointer",
        }}
      >
        Return to top
      </button>
    </GridContainer>
  );

  return (
    <>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <GovBanner />
      <Header extended showMobileOverlay={mobileNavOpen}>
        <div className="usa-navbar">
          <Title id="extended-logo">
            <a href="/" title="Home" aria-label="Home">
              Project title
            </a>
          </Title>
          <NavMenuButton
            label="Menu"
            onClick={toggleMobileNav}
            className="usa-menu-btn"
          />
        </div>

        <ExtendedNav
          aria-label="Primary navigation"
          primaryItems={primaryNavItems}
          secondaryItems={secondaryNavItems}
          onToggleMobileNav={toggleMobileNav}
          mobileExpanded={mobileNavOpen}
        >
          <div className="display-flex" style={{ alignItems: "center" }}>
            <Search
              size="small"
              onSubmit={handleSearch}
              style={{ margin: 0 }}
            />
            <LoginButton />
          </div>
        </ExtendedNav>
      </Header>

      <Outlet />

      <Footer
        returnToTop={returnToTop}
        primary={footerPrimary}
        secondary={footerSecondary}
      />
    </>
  );
};

export default LandingPage;
