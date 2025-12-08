export default function Modules() {
  return (
    <div>
      <div id="wd-modules-actions">
        <button>Collapse All</button>
        <button>View Progress</button>
        <select>
          <option>Publish All</option>
        </select>
        <button>+ Module</button>
      </div>
      <ul id="wd-modules">
        <li>
          <b>Week 1, Lecture 1 - Course Introduction, Syllabus, Agenda</b>
          <ul>
            <li>
              <span><b>LEARNING OBJECTIVES</b></span>
              <ul>
                <li>Introduction to the course</li>
                <li>Learn what is Web Development</li>
              </ul>
            </li>
            <li>
              <span ><b>READING</b></span>
              <ul>
                <li>Full Stack Developer - Chapter 1 - Introduction</li>
                <li>Full Stack Developer - Chapter 2 - Creating Us</li>
              </ul>
            </li>
            <li>
              <span><b>SLIDES</b></span>
              <ul>
                <li>Introduction to Web Development</li>
                <li>Creating an HTTP server with Node.js</li>
                <li>Creating a React Application</li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <b>Week 1, Lecture 2 - Formatting User Interfaces with HTML</b>
          <ul>
            <li>
              <span><b>LEARNING OBJECTIVES</b></span>
              <ul>
                <li>Learn how to create user interfaces with HTML</li>
                <li>Deploy the assignment to Netlify</li>
              </ul>
            </li>
            <li>
              <span><b>SLIDES</b></span>
              <ul>
                <li>Introduction to HTML and the DOM</li>
                <li>Formatting Web content with Headings and</li>
                <li>Formatting content with Lists and Tables</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}