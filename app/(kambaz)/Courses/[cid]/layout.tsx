import { ReactNode } from "react";
import KambazNavigation from "../../Navigation";
import CourseNavigation from "./Navigation";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  return (
    <table style={{ width: "100%" }}>
      <tbody>
        <tr>
          <td valign="top" width="180">
            <KambazNavigation />
          </td>
          <td valign="top" width="180">
            <CourseNavigation />
          </td>
          <td valign="top" width="100%">
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
