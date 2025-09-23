import Navigation from "../Navigation";
export default function Assignments({ params }: { params: Record<string, string> }) {
    const { cid } = params;
    return (
        <div id="wd-home">
            <h1><b>Course {cid}</b></h1>
            <hr />
            <table>
                <tbody>
                    <tr>
                        <td valign="top" width="180">
                            <Navigation cid={cid} />
                        </td>
                        <td valign="top" width="70%">
                            <div id="wd-assignments">
                                <input placeholder="Search for Assignments"
                                    id="wd-search-assignment" />
                                <button id="wd-add-assignment-group">+ Group</button>
                                <button id="wd-add-assignment">+ Assignment</button>
                                <h3 id="wd-assignments-title">
                                    ASSIGNMENTS 40% of Total <button>+</button> </h3>
                                <ul id="wd-assignment-list">
                                    <li className="wd-assignment-list-item1">
                                        <a href={`/Courses/${cid}/Assignments/${cid}`}
                                            className="wd-assignment-link" >
                                            A1 - ENV + HTML

                                        </a>
                                        <br />
                                        Multiple Modules | <b>Not available until</b> May 6 at 12:00 AM |
                                        <b>Due</b> May 13 at 11:59 PM | <b>Points</b> 10 pts
                                    </li>
                                    <br /><br />

                                    <li className="wd-assignment-list-item2">
                                        <a href={`/Courses/${cid}/Assignments/${cid}`}
                                            className="wd-assignment-link" >
                                            A2 - CSS + BOOTSTRAP
                                        </a>
                                        <br />
                                        Multiple Modules | <b>Not available until</b> May 13 at 12:00 AM |
                                        <b>Due</b> May 20 at 11:59 PM | <b>Points</b> 20 pts
                                    </li>
                                    <br /><br />

                                    <li className="wd-assignment-list-item3">
                                        <a href={`/Courses/${cid}/Assignments/${cid}`}
                                            className="wd-assignment-link" >
                                            A3 - JAVASCRIPT + REACT
                                        </a>
                                        <br />
                                        Multiple Modules | <b>Not available until</b> May 20 at 12:00 AM |
                                        <b>Due</b> May 27 at 11:59 PM | <b>Points</b> 20 pts
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

