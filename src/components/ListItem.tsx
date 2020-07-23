// import React from "react";
// import {ILink} from "../types/ILink";
// import {ListItem, ListItemAvatar,Avatar,ListItemText,ListItemSecondaryAction,Checkbox} from "@material-ui/core";

// export function ListsItem(props: React.PropsWithoutRef<{ link: ILink}>){
//     const [checked, setChecked] = React.useState([1]);

//     const handleToggle = (value: number) => () => {
//       const currentIndex = checked.indexOf(value);
//       const newChecked = [...checked];
  
//       if (currentIndex === -1) {
//         newChecked.push(value);
//       } else {
//         newChecked.splice(currentIndex, 1);
//       }
  
//       setChecked(newChecked);
//     };

//     return(
//         <ListItem key={props.link.id} button style={{height:130}}>
//             <ListItemAvatar>
//               <Avatar
//               />
//             </ListItemAvatar>
//             <ListItemText style={{marginLeft:0}} primary={props.link.linkKey} secondary={props.link.href}/>
//             {/* <ListItemSecondaryAction>
//               <Checkbox
//                 edge="end"
//                 onChange={handleToggle(i)}
//                 checked={checked.indexOf(i) !== -1}
//               />
//             </ListItemSecondaryAction> */}
//           </ListItem>
//     )
// }