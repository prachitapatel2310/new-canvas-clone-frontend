import Modules from "../Modules/page";
import CourseStatus from "./Status";
export default function Home() {
 return (
   <div id="wd-home">
     <table>
        <div>
          <table>
            <tbody>
              <tr>
                <td valign="top">
                  <Modules />
                </td>
                <td valign="top">
                  <CourseStatus />
                </td>
              </tr>
            </tbody>
          </table>
        </div>      
     </table>
   </div>
 );
}

