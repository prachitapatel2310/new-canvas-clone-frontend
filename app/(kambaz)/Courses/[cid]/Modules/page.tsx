export default function Modules() {
  return (
    <div>
      <h1 style={{ marginBottom: 0 }}>Course 1234</h1>
      <hr />
      <div style={{ marginBottom: '8px' }}>
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
              <span style={{ fontWeight: "bold" }}>LEARNING OBJECTIVES</span>
              <ul>
                <li>Introduction to the course</li>
                <li>Learn what is Web Development</li>
              </ul>
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>READING</span>
              <ul>
                <li>Full Stack Developer - Chapter 1 - Introduction</li>
                <li>Full Stack Developer - Chapter 2 - Creating Us</li>
              </ul>
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>SLIDES</span>
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
              <span style={{ fontWeight: "bold" }}>LEARNING OBJECTIVES</span>
              <ul>
                <li>Learn how to create user interfaces with HTML</li>
                <li>Deploy the assignment to Netlify</li>
              </ul>
            </li>
            <li>
              <span style={{ fontWeight: "bold" }}>SLIDES</span>
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