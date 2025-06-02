import React, { useState } from "react";
import {
  GovBanner,
  Header,
  Title,
  GridContainer,
  Grid,
  Form,
  Fieldset,
  Label,
  TextInput,
  Button,
  Checkbox,
  Footer,
  Identifier,
  IdentifierMasthead,
  IdentifierLogos,
  IdentifierLogo,
  IdentifierIdentity,
  IdentifierLinks,
  IdentifierLinkItem,
  IdentifierLink,
  IdentifierGov,
  MediaBlockBody,
  Link,
  Address,
  FooterNav,
  Logo,
  SocialLink,
  SocialLinks,
} from "@trussworks/react-uswds";
import circleImg from "app/src/assets/circleImg.png";

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
        image={<img className="usa-footer__logo-img" src={circleImg} alt="" />}
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

const checkboxLabel = "I agree to the terms and conditions";

// 🧪 Replace this with your real submit handler
const mockSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  console.log("Form submitted");
};

export default function CreateAccountPage(): JSX.Element {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>

      <GovBanner />

      <Header extended>
        <div className="usa-navbar">
          <Title id="extended-logo">
            <a href="/" title="Home" aria-label="Home">
              Project title
            </a>
          </Title>
        </div>
      </Header>

      <main id="main-content">
        <div className="bg-base-lightest">
          <GridContainer className="usa-section">
            <Grid row className="margin-x-neg-205 flex-justify-center">
              <Grid
                col={12}
                mobileLg={{ col: 10 }}
                tablet={{ col: 8 }}
                desktop={{ col: 6 }}
                className="padding-x-205 margin-bottom-4"
              >
                <h1 className="desktop:display-none font-sans-lg margin-bottom-4 tablet:margin-top-neg-3">
                  A tagline that explains the benefit of creating an account.
                </h1>

                <div className="bg-white padding-y-3 padding-x-5 border border-base-lighter">
                  <h1 className="margin-bottom-0">Create account</h1>
                  <Form onSubmit={mockSubmit}>
                    <Fieldset legend="Get started with an account.">
                      <p>
                        <abbr
                          title="required"
                          className="usa-hint usa-hint--required"
                        >
                          *
                        </abbr>{" "}
                        indicates a required field.
                      </p>

                      <Label htmlFor="email">
                        Email address{" "}
                        <abbr title="required" className="usa-label--required">
                          *
                        </abbr>
                      </Label>
                      <TextInput
                        id="email"
                        name="email"
                        type="email"
                        autoCapitalize="off"
                        autoCorrect="off"
                        required
                      />

                      <Label htmlFor="password-create-account">
                        Create password{" "}
                        <abbr title="required" className="usa-label--required">
                          *
                        </abbr>
                      </Label>
                      <TextInput
                        id="password-create-account"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="off"
                        autoCorrect="off"
                        required
                      />

                      <button
                        title="Show password"
                        type="button"
                        className="usa-show-password"
                        aria-controls="password-create-account password-create-account-confirm"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? "Hide password" : "Show password"}
                      </button>

                      <Label htmlFor="password-create-account-confirm">
                        Re-type password{" "}
                        <abbr title="required" className="usa-label--required">
                          *
                        </abbr>
                      </Label>
                      <TextInput
                        id="password-create-account-confirm"
                        name="password-confirm"
                        type={showPassword ? "text" : "password"}
                        autoCapitalize="off"
                        autoCorrect="off"
                        required
                      />

                      <Checkbox
                        id="terms-and-conditions"
                        name="terms-and-conditions"
                        className="margin-y-3"
                        required
                        label={checkboxLabel}
                      />

                      <Button type="submit">Create account</Button>
                    </Fieldset>
                  </Form>
                </div>

                <p className="text-center">
                  Already have an account? <Link href="/login">Sign in</Link>.
                </p>
              </Grid>

              <Grid
                col={12}
                mobileLg={{ col: 10 }}
                tablet={{ col: 8 }}
                desktop={{ col: 6 }}
                className="padding-x-205"
              >
                <div className="border-top border-base-lighter padding-top-4 desktop:border-0 desktop:padding-top-0">
                  <h2 className="display-none desktop:display-block">
                    A tagline that explains the benefit of creating an account.
                  </h2>

                  <div className="usa-prose">
                    <p>
                      Here’s space for a longer description to introduce 3-5
                      easily scannable bullet points.
                    </p>
                    <section className="usa-graphic-list">
                      <div className="usa-graphic-list__row">
                        {Array.from({ length: 3 }, (_, idx) => (
                          <div className="usa-media-block margin-y-2" key={idx}>
                            <img
                              className="usa-media-block__img height-7 width-7"
                              src={circleImg}
                              alt="Alt text"
                            />
                            <MediaBlockBody>
                              <p>
                                <strong>Value proposition {idx + 1}:</strong>{" "}
                                Vivamus nec velit sed leo scelerisque laoreet
                                vestibulum.
                              </p>
                            </MediaBlockBody>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="border-top border-base-lighter margin-top-3 padding-top-1">
                    <h2>Are you a federal employee?</h2>
                    <div className="usa-prose">
                      <p>
                        If you are a federal employee or [other secondary user],
                        please use [secondary Single Sign On (SSO)].
                      </p>
                      <p>
                        <Button type="button" outline>
                          Launch secondary SSO
                        </Button>
                      </p>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </GridContainer>
        </div>
      </main>

      <Footer
        returnToTop={returnToTop}
        primary={footerPrimary}
        secondary={footerSecondary}
      />
    </>
  );
}
