// import Navigation from "../Navigation";
// export default function Piazza({ params }: { params: { cid: string } }) {
//   const { cid } = params;
//   return (
//     <div id="wd-piazza">
//       <h1><b>Course {cid}</b></h1>
//       <hr />
//       <table>
//         <tbody>
//           <tr>
//             {/* <td valign="top" width="180"> 
//               <Navigation cid={cid} />
//             </td> */}
//             <td valign="top" width="100%">
//                 <h1>Piazza Integration Coming Soon!</h1>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { use } from 'react';
export default function Piazza({ params }: { params: Promise<{ cid: string }> }) {
  const { cid } = use(params);
  
  return (
    <div id="wd-piazza">
      <h2>Piazza</h2>
      <hr />
      <div className="alert alert-info" role="alert">
        <h3>Piazza Integration Coming Soon!</h3>
        <p className="mb-0">This feature will be available in a future update.</p>
      </div>
    </div>
  );
}