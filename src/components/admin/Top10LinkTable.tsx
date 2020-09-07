import React, {forwardRef} from "react";
import {ITopLink} from "../../types/IAdminStat";
import {Card, CardContent} from "@material-ui/core";
import MaterialTable, {Icons} from "material-table";
import {ILink} from "../../types/ILink";
import urljoin from "url-join";
import config from "../../config";

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

export const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

function renderLinkField(field: keyof ILink) {
  return (topLink: ITopLink, type: "row" | "group") => {
    switch (field) {
      case "linkKey":
        return urljoin(config.shortenLinkBaseURL, topLink.link.linkKey);
      case "user":
        return topLink.link.user.username;
      default:
        return topLink.link[field];
    }
  }
}

export function Top10LinkTable(props: React.PropsWithoutRef<{ links: ITopLink[] }>) {
  return (
    <Card style={{
      margin: 20
    }}>
      <CardContent>
        <MaterialTable<ITopLink>
          icons={tableIcons}
          title={"最热链接Top10详情"}
          options={{
            search: false
          }}
          columns={[
            {
              title: '短链接',
              render: renderLinkField('linkKey')
            },
            {
              title: '完整链接',
              render: renderLinkField('href')
            },
            {
              title: '创建用户',
              render: renderLinkField('user')
            },
            {
              title: '总访问量',
              field: 'count'
            }
          ]}
          data={props.links}
        />
      </CardContent>
    </Card>
  )
}
