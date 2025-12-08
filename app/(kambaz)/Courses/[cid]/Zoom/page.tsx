// import Navigation from "../Navigation";
// export default function Zoom({ params }: { params: { cid: string } }) {
//   const { cid } = params;
//   return (
//     <div id="wd-zoom">
//       <h1><b>Course {cid}</b></h1>
//       <hr />
//       <table>
//         <tbody>
//           <tr>
//             <td valign="top" width="180"> 
//               <Navigation cid={cid} />
//             </td>
//             <td valign="top" width="100%">
//                 <h1>Zoom Integration Coming Soon!</h1>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { use } from 'react';

export default function Zoom({ params }: { params: Promise<{ cid: string }> }) {
  const { cid } = use(params);
  
  return (
    <div id="wd-zoom">
      <h1>Zoom</h1>
      <hr />
      <div className="alert alert-success" role="alert">
        <h4>Zoom Integration Coming Soon!</h4>
        <p className="mb-0">This feature will be available in a future update.</p>
      </div>
    </div>
  );
}