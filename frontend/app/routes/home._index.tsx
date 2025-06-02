import { GridContainer, Grid, MediaBlockBody } from "@trussworks/react-uswds";
import circleImg from 'app/src/assets/circleImg.png'


export default function Index(){

    return (
        <>
        <main id="main-content">
        {/* Hero Section */}
        <section className="usa-hero" aria-label="Introduction" style = {{backgroundImage: "url('app/src/assets/placeholder.webp')"}}>
          <GridContainer>
            <div className="usa-hero__callout">
              <h1 className="usa-hero__heading">
                <span className="usa-hero__heading--alt">Hero callout:</span> Bring attention to a project priority
              </h1>
              <p>Support the callout with some short explanatory text.</p>
              <a className="usa-button" href=" ">Call to action</a>
            </div>
          </GridContainer>
        </section>

        {/* Tagline Section */}
        <section className="grid-container usa-section">
          <Grid row gap>
            <Grid tablet={{ col: 4 }}>
              <h2 className="font-heading-xl margin-top-0 tablet:margin-bottom-0">A tagline highlights your approach</h2>
            </Grid>
            <Grid tablet={{ col: 8 }} className="usa-prose">
              <p>The tagline should inspire confidence and interest...</p>
              <p>Use the right side of the grid to explain the tagline a bit more.</p>
            </Grid>
          </Grid>
        </section>

        {/* Graphic List Section */}
        <section className="usa-graphic-list usa-section usa-section--dark">
          <GridContainer>
            {[0, 1].map((row) => (
              <Grid row gap className="usa-graphic-list__row" key={`graphic-row-${row}`}>
                {[0, 1].map((col) => (
                  <Grid tablet={{ col: true }} className="usa-media-block" key={`graphic-col-${row}-${col}`}>
                    <img className="usa-media-block__img" src={circleImg} alt="Alt text" />
                    <MediaBlockBody>
                      <h2 className="usa-graphic-list__heading">Graphic heading</h2>
                      <p>Explanation of this section’s focus and intent.</p>
                    </MediaBlockBody>
                  </Grid>
                ))}
              </Grid>
            ))}
          </GridContainer>
        </section>

        {/* CTA Section */}
        <section id="test-section-id" className="usa-section">
          <GridContainer>
            <h2 className="font-heading-xl margin-y-0">Section heading</h2>
            <p className="usa-intro">Encourage users to act with this section.</p>
            <a href=" " className="usa-button usa-button--big">Call to action</a>
          </GridContainer>
        </section>
      </main>
      </>
    );
}