import Navigation from "../Navigation";
export default function People({ params }: { params: { cid: string } }) {
  const { cid } = params;
  return (
    <div id="wd-people">
      <h1><b>Course {cid}</b></h1>
      <hr />
      <table>
        <tbody>
          <tr>
            <td valign="top" width="180"> 
              <Navigation cid={cid} />
            </td>
            <td valign="top" width="100%">
                <h1>People Integration Coming Soon!</h1>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}