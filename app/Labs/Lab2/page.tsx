"use client";
import "./index.css";
import Foreground from "./ForegroundColors";
import Background from "./BackgroundColors";
import Borders from "./Borders";
import Padding from "./Padding";
import Margins from "./Margins";
import Corners from "./Corners";
import Dimension from "./Dimensions";
import Positions from "./Positions";
import Zindex from "./Zindex";
import Float from "./Float";
import Grid from "./GridLayout";
import Flex from "./Flex";
import ReactIconsSampler from "./ReactIcons";
import Boot from "./BootstrapGrids";
import ScreenSizeLabel from "./ScreenSizeLabel";
import BootstrapTables from "./BootstrapTables";
import BootstrapLists from "./BootstrapLists";
import BootstrapNavigation from "./BootstrapNavigation";
import BootstrapForms from "./BootstrapForms";
import { Container } from "react-bootstrap";
export default function Lab2() {
  return (
    <Container>
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <h3>Styling with the STYLE attribute</h3>
      <p id="wd-css-style-attribute">
        Style attribute allows configuring look and feel right on the element.
        Although it&apos;s very convenient it is considered bad practice and you
        should avoid using the style attribute
      </p>
      <div id="wd-css-id-selectors">
        <h3>ID selectors</h3>
        <p id="wd-id-selector-1">
          Instead of changing the look and feel of all the
          elements of the same name, e.g., P, we can refer to a specific element by its ID
        </p>
        <p id="wd-id-selector-2">
          Here&apos;s another paragraph using a different ID and a different
          look and feel
        </p>
      </div>
      <div id="wd-css-class-selectors">
        <h3>Class selectors</h3>

        <p className="wd-class-selector">
          Instead of using IDs to refer to elements, you can use an element&apos;s
          CLASS attribute        </p>

        <h4 className="wd-class-selector">
          This heading has same style as paragraph above
        </h4>
      </div>
      <div id="wd-css-document-structure">
        <div className="wd-selector-1">
          <h3>Document structure selectors</h3>
          <div className="wd-selector-2">
            Selectors can be combined to refer elements in particular
            places in the document
            <p className="wd-selector-3">
              This paragraph&apos;s red background is referenced as              <br />
              .selector-2 .selector3<br />
              meaning the descendant of some ancestor.<br />
              <span className="wd-selector-4">
                Whereas this span is a direct child of its parent
              </span><br />
              You can combine these relationships to create specific
              styles depending on the document structure
            </p>
          </div>
        </div>
      </div>
      <div id="wd-foreground-colors">
        <h1>Foreground colors</h1>
        <Foreground />
      </div>
      <div id="wd-background-colors">
        <h1>Background colors</h1>
        <Background />
      </div>
      <div id="wd-borders">
        <Borders />
      </div>
      <div id="wd-paddings">
        <Padding />
      </div>
      <div id="wd-margins">
        <Margins />
      </div>
      <div id="wd-corners">
        <Corners />
      </div>
      <div id="wd-dimensions">
        <Dimension />
      </div>
      <div id="wd-positions">
        <h1>Positions</h1>
        <Positions />
      </div>
      <div id="wd-zindex">
        <Zindex />
      </div>
      <div id="wd-float">
        <Float />
      </div>
      <div id="wd-grid-layout">
        <Grid />
      </div>
      <div id="wd-flexbox">
        <Flex />
      </div>
      <div id="wd-react-icons">
        <ReactIconsSampler />
      </div>
      <div>
        <Boot />
      </div>
      <div>
        <ScreenSizeLabel />
      </div>
      <div>
        <BootstrapTables />
      </div>
      <div>
        <BootstrapLists />
      </div>
      <div>
        <BootstrapForms />
      </div>
      <div>
        <BootstrapNavigation />
      </div>
    </Container>
  );
}
