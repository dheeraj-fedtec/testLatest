// import React, { useState } from "react";
// import {
//   GovBanner,
//   Header,
//   Title,
//   GridContainer,
//   Grid,
//   Form,
//   Fieldset,
//   Label,
//   TextInput,
//   Button,
//   Footer,
//   Link,
//   Address,
//   FooterNav,
//   Logo,
//   SocialLinks,
//   SocialLink,
// } from "@trussworks/react-uswds";

// import circleImg from "app/src/assets/circleImg.png";

// const returnToTop = (
//   <GridContainer className="usa-footer__return-to-top">
//     <button
//       type="button"
//       onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//       style={{
//         background: "none",
//         border: "none",
//         color: "blue",
//         textDecoration: "underline",
//         cursor: "pointer",
//       }}
//     >
//       Return to top
//     </button>
//   </GridContainer>
// );

// const socialLinkItems = [
//   <SocialLink key="facebook" name="Facebook" href=" " />,
//   <SocialLink key="twitter" name="Twitter" href=" " />,
//   <SocialLink key="youtube" name="YouTube" href=" " />,
//   <SocialLink key="instagram" name="Instagram" href=" " />,
//   <SocialLink key="rss" name="RSS" href=" " />,
// ];

// const footerPrimary = (
//   <FooterNav
//     aria-label="Footer navigation"
//     size="medium"
//     links={Array(5).fill(
//       <a href=" " className="usa-footer__primary-link">
//         Primary link
//       </a>
//     )}
//   />
// );

// const footerSecondary = (
//   <>
//     <Grid row gap>
//       <Logo
//         size="medium"
//         image={<img className="usa-footer__logo-img" src={circleImg} alt="" />}
//         heading={<p className="usa-footer__logo-heading">Name of Agency</p>}
//       />
//       <Grid className="usa-footer__contact-links" mobileLg={{ col: 6 }}>
//         <SocialLinks links={socialLinkItems} />
//         <h3 className="usa-footer__contact-heading">Agency Contact Center</h3>
//         <Address
//           size="medium"
//           items={[
//             <a key="telephone" href="tel:1-800-555-5555">
//               (800) CALL-GOVT
//             </a>,
//             <a key="email" href="mailto:info@agency.gov">
//               info@agency.gov
//             </a>,
//           ]}
//         />
//       </Grid>
//     </Grid>
//   </>
// );

// // Mock submit handler
// const mockSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//   event.preventDefault();
//   console.log("Form submitted!");
// };

// export default function SignInPage(): JSX.Element {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <>
//       <a className="usa-skipnav" href="#main-content">
//         Skip to main content
//       </a>

//       <GovBanner />

//       <Header extended>
//         <div className="usa-navbar">
//           <Title id="extended-logo">
//             <a href="/" title="Home" aria-label="Home">
//               Project title
//             </a>
//           </Title>
//         </div>
//       </Header>

//       <main id="main-content">
//         <div className="bg-base-lightest">
//           <GridContainer className="usa-section">
//             <Grid row className="flex-justify-center">
//               <Grid col={12} tablet={{ col: 8 }} desktop={{ col: 6 }}>
//                 <div className="bg-white padding-y-3 padding-x-5 border border-base-lighter">
//                   <h1 className="margin-bottom-0">Sign in</h1>
//                   <Form onSubmit={mockSubmit}>
//                     <Fieldset legend="Access your account" legendStyle="large">
//                       <Label htmlFor="email">Email address</Label>
//                       <TextInput
//                         id="email"
//                         name="email"
//                         type="email"
//                         autoCorrect="off"
//                         autoCapitalize="off"
//                         required
//                       />

//                       <Label htmlFor="password-sign-in">Password</Label>
//                       <TextInput
//                         id="password-sign-in"
//                         name="password"
//                         type={showPassword ? "text" : "password"}
//                         autoCorrect="off"
//                         autoCapitalize="off"
//                         required
//                       />

//                       <button
//                         title="Show password"
//                         type="button"
//                         className="usa-show-password"
//                         aria-controls="password-sign-in"
//                         onClick={() => setShowPassword((prev) => !prev)}
//                       >
//                         {showPassword ? "Hide password" : "Show password"}
//                       </button>

//                       <Button type="submit">Sign in</Button>

//                       <p>
//                         <Link href="#">Forgot password?</Link>
//                       </p>
//                     </Fieldset>
//                   </Form>
//                 </div>

//                 <p className="text-center">
//                   Don't have an account?{" "}
//                   <Link href="/signup">Create your account now</Link>.
//                 </p>

//                 <div className="border-top border-base-lighter margin-top-3 padding-top-1">
//                   <h2>Are you a federal employee?</h2>
//                   <div className="usa-prose">
//                     <p>
//                       If you are a federal employee or [other secondary user],
//                       please use [secondary Single Sign On (SSO)].
//                     </p>
//                     <p>
//                       <Button type="button" outline>
//                         Launch secondary SSO
//                       </Button>
//                     </p>
//                   </div>
//                 </div>
//               </Grid>
//             </Grid>
//           </GridContainer>
//         </div>
//       </main>

//       <Footer
//         returnToTop={returnToTop}
//         primary={footerPrimary}
//         secondary={footerSecondary}
//       />
//     </>
//   );
// }

// app/routes/auth/login.tsx
import { redirect } from "@remix-run/node";
import { getBackendUrl } from "~/config";

export const loader = async () => {
  const backendUrl = await getBackendUrl();
  return redirect(
    `${backendUrl}/realms/react-template/protocol/openid-connect/auth?` +
      new URLSearchParams({
        client_id: `${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}`,
        redirect_uri: `${import.meta.env.VITE_URL}/callback`,
        response_type: "code",
        scope: "openid profile email",
      }).toString()
  );
};
