import React from "react";
import {ILink} from "../types/ILink";
import {
    Avatar,
    Checkbox,
    ListItem as LItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText
} from "@material-ui/core";

export function ListItem(props: React.PropsWithoutRef<{ item: ILink }>) {
  const [checked, setChecked] = React.useState([1]);
  const {item} = props;
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  return (
    <LItem key={item.id} style={{height: 120}}>
      <ListItemAvatar>
        <Avatar
        />
      </ListItemAvatar>
      <ListItemText style={{marginLeft: 0}} primary={item.linkKey} secondary={item.href}/>
      <ListItemSecondaryAction>
        <Checkbox
          edge="end"
          onChange={handleToggle(item.id)}
          checked={checked.indexOf(item.id) !== -1}
        />
      </ListItemSecondaryAction>
    </LItem>

  )
}